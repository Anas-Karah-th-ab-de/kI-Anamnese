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

def generate_questions(patient_text, patient_age):
    prompt = f"Based on the patient's complaint: \"{patient_text}\" and age {patient_age}, generate specific follow-up questions:"

    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=50,
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
        max_tokens=50,
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
        patient_text = data["patient_text"]
        patient_age = data["patient_age"]

        questions = generate_questions(patient_text, patient_age)

        # Erkennen der Sprache von Patientenbeschwerden
        translator = Translator()
        detected_language = translator.detect(patient_text).lang

        # Übersetzen der Fragen in die erkannte Sprache
        translated_questions = [translator.translate(question, dest=detected_language).text for question in questions]

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

        # Erkennen der Sprache der Patientenantwort
        translator = Translator()
        detected_language = translator.detect(patient_answer).lang

        # Übersetzen der Frage in die erkannte Sprache
        translated_question = translator.translate(follow_up_question, dest=detected_language).text

        return jsonify({"follow_up_question": translated_question})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({"error": str(e)}), 400


@app.route("/submit_to_doctor", methods=["POST"])
def submit_to_doctor():
    data = request.get_json()

    # Verwenden Sie 'name' und 'age' anstelle von 'patient_name' und 'patient_age'
    patient_name = data.get("name", "Unknown")
    patient_age = data.get("age", "Unknown")

    patient_text = data["patient_text"]
    questions = data["questions"]
    answers = data["answers"]

    # Fügen Sie patient_name und patient_age zu den eingereichten Daten hinzu
    submitted_data.append({
        "patient_name": patient_name,
        "patient_age": patient_age,
        "patient_text": patient_text,
        "questions": questions,
        "answers": answers
    })

    return jsonify({"message": "Data submitted successfully", "patient_name": patient_name, "patient_age": patient_age, "patient_text": patient_text, "questions": questions, "answers": answers})

@app.route("/get_patients_data", methods=["GET"])
def get_patients_data():
    return jsonify({"patients_data": submitted_data})

@app.route("/", methods=["GET"])
def home():
    return "Flask backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
