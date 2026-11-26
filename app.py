import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.environ.get("GeminiAPIKey"))

@app.get("/")
def home():
    return "VDF Support Backend is running"

@app.post("/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "message is required"}), 400

    prompt = f"Jsi technická podpora. Odpověz stručně a česky na tento dotaz: {message}"
modely = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-3.8-pro"]
    posledni_chyba = ""

    for model_name in modely:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            return jsonify({"reply": response.text})
        except Exception as e:
            posledni_chyba = str(e)
            time.sleep(1)
            continue

    return jsonify({"error": f"Všechny modely jsou momentálně nedostupné: {posledni_chyba}"}), 503

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=True)
