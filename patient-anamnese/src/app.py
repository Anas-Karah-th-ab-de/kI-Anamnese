from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Erlaubt CORS für alle Routen und alle Domains

openai.api_key = "2YEyqtsJUHBBi8dOGNQOT3BlbkFJ8Pi9kogQcSvKH402mOcM"

def generate_questions(patient_text):
    prompt = f"Based on the patient's complaint: \"{patient_text}\", generate specific follow-up questions:"

    response = openai.Completion.create(
        engine="davinci-codex",
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
    data = request.get_json()
    patient_text = data["patient_text"]
    questions = generate_questions(patient_text)
    return jsonify({"questions": questions})

if __name__ == "__main__":
    app.run(debug=True)

