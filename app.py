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

    # Zkusí model až 3x (pokud má Google dočasně přetíženo 503, počká 2 sekundy)
    for pokus in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt
            )
            return jsonify({"reply": response.text})
        except Exception as e:
            if "503" in str(e) and pokus < 2:
                time.sleep(2)
                continue
            return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=True)
