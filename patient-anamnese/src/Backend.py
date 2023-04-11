import openai

openai.api_key = "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"

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
