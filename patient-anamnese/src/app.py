from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app, resources={r"/*": {"origins": "*"}})  # Erlaubt CORS für alle Routen und alle Domains

openai.api_key = "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"

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
    return question_text


@app.route("/generate_questions", methods=["POST"])
def generate_questions_route():
    content_type = request.headers.get("Content-Type")
    print("Request Content-Type:", content_type)
    try:
        data = request.get_json()
        patient_text = data["patient_text"]
        patient_age = data["patient_age"]
        questions = generate_questions(patient_text, patient_age)
        return jsonify({"questions": questions})
    except Exception as e:
        print("Error while processing request:", e)
        return jsonify({"error": str(e)}), 400


@app.route("/", methods=["GET"])
def home():
    return "Flask backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
