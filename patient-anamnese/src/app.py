from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from googletrans import Translator

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app, resources={r"/*": {"origins": "*"}})  # Erlaubt CORS für alle Routen und alle Domains

openai.api_key = "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"
global submitted_data
submitted_data = []
def detect_language_openai(text):
    prompt = f"Detect the language of the following text: \"{text}\""
    detected_language = generate_gpt3_response(prompt)
    return detected_language

def translate_text_openai(text, target_language):
    prompt = f"Translate the following text to {target_language}: \"{text}\""
    translated_text = generate_gpt3_response(prompt)
    return translated_text

def generate_questions(patient_text, patient_age, patient_gender):
    prompt = f"Based on the patient's complaint: \"{patient_text}\", age {patient_age}, and biological gender {patient_gender}, generate specific follow-up questions:"
    
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=0.5,
    )

    question_text = response.choices[0].text.strip()
    questions = question_text.split("\n")  # Split the text into an array of questions
    return questions

def generate_follow_up_questions(prev_question, patient_answer):
    prompt = f"Previous question: {prev_question}\nPatient's answer: {patient_answer}\nGenerate a follow-up question based on the patient's answer:"
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=0.5,
    )

    follow_up_question = response.choices[0].text.strip()
    return follow_up_question

@app.route("/generate_questions", methods=["POST"])
def generate_questions_route():
    content_type = request.headers.get("Content-Type")
    print("Request Content-Type:", content_type)
    try:
        data = request.get_json()
        print("Received data:", data)
        patient_text = data["patient_text"]
        patient_age = data["patient_age"]
        patient_gender = data["patient_gender"]
        questions = generate_questions(patient_text, patient_age, patient_gender)
        print("Generated questions:", questions)

        # Detect language of the patient's complaint
        detected_language = detect_language_openai(patient_text)
        print("Detected language:", detected_language)

        # Translate the questions into the detected language
        translated_questions = []
        for question in questions:
            try:
                translated_question = translate_text_openai(question, detected_language)
                translated_questions.append(translated_question)
            except Exception as e:
                print(f"Error while translating question '{question}':", e)
                translated_questions.append(question)

        print("Translated questions:", translated_questions)
        return jsonify({"questions": translated_questions})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({"error": str(e)}), 400


@app.route("/generate_follow_up_questions", methods=["POST"])
def generate_follow_up_questions_route():
    content_type = request.headers.get("Content-Type")
    print("Request Content-Type:", content_type)
    try:
        data = request.get_json()
        prev_question = data["prev_question"]
        patient_answer = data["patient_answer"]

        follow_up_question = generate_follow_up_questions(prev_question, patient_answer)

        # Detect language of the patient's answer
        detected_language = detect_language_openai(patient_answer)

        # Translate the question into the detected language
        try:
            translated_question = translate_text_openai(follow_up_question, detected_language)
        except Exception as e:
            print(f"Error while translating follow-up question '{follow_up_question}':", e)
            translated_question = follow_up_question

        return jsonify({"follow_up_question": translated_question})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/submit_to_doctor", methods=["POST"])
def submit_to_doctor():
    data = request.get_json()

    patient_name = data.get("name", "Unknown")
    patient_age = data.get("age", "Unknown")
    patient_gender = data.get("gender", "Unknown")

    patient_text = data["patient_text"]
    questions = data["questions"]
    answers = data["answers"]

    # Filter non-empty questions and answers
    answered_questions = []
    answered_answers = []
    for question, answer in zip(questions, answers):
        if answer.strip():
            answered_questions.append(question)
            answered_answers.append(answer)

    # Fügen Sie patient_name und patient_age zu den eingereichten Daten hinzu
    submitted_data.append({
        "patient_name": patient_name,
        "patient_age": patient_age,
        "patient_gender" : patient_gender,
        "patient_text": patient_text,
        "questions": questions,
        "answers": answers
    })

    return jsonify({"message": "Data submitted successfully", "patient_name": patient_name, "patient_age": patient_age,"patient_gender" : patient_gender, "patient_text": patient_text, "questions": questions, "answers": answers})

@app.route("/get_patients_data", methods=["GET"])
def get_patients_data():
    return jsonify({"patients_data": submitted_data})

@app.route("/", methods=["GET"])
def home():
    return "Flask backend is running!"
@app.route("/translate_text", methods=["POST"])
def translate_text_route():
    content_type = request.headers.get("Content-Type")
    print("Request Content-Type:", content_type)
    try:
        data = request.get_json()
        text = data["text"]
        target_language = data["target_language"]
        delimiter = data.get("delimiter", None)

        translated_text_lines = []
        for line in text.split(delimiter):
            try:
                translated_line = translate_text_openai(line, target_language)
                translated_text_lines.append(translated_line)
            except Exception as e:
                print(f"Error while translating line '{line}':", e)
                translated_text_lines.append(line)

        translated_text = (delimiter or "\n").join(translated_text_lines)

        return jsonify({"translated_text": translated_text})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({"error": str(e)}), 400

def generate_gpt3_response(prompt: str) -> str:
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=0.5,
    )
    return response.choices[0].text.strip()

@app.route("/summarize_text", methods=["POST"])
def summarize_text_route():
    try:
        data = request.get_json()
        text = data["text"]

        prompt = f"Please summarize the following text:\n\n{text}\n\nSummary:"
        summary = generate_gpt3_response(prompt)

        return jsonify({"summary": summary})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/suggest_diagnosis", methods=["POST"])
def suggest_diagnosis_route():
    try:
        data = request.get_json()
        patient = data["patient"]

        prompt = f"Based on the patient's information:\n\n{patient}\n\nSuggest a possible diagnosis:"
        diagnosis = generate_gpt3_response(prompt)

        return jsonify({"diagnosis": diagnosis})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({"error": str(e)}), 400

@app.route("/suggest_medication", methods=["POST"])
def suggest_medication_route():
    try:
        data = request.get_json()
        patient = data["patient"]

        prompt = f"Based on the patient's information:\n\n{patient}\n\nSuggest appropriate medication:"
        medication = generate_gpt3_response(prompt)

        return jsonify({"medication": medication})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
