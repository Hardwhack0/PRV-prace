import os
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

  try:
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=f"Jsi technická podpora. Odpověz stručně a česky na tento dotaz: {message}"
            )
        except Exception:
            response = client.models.generate_content(
                model="gemini-3.8-flash-lite",
                contents=f"Jsi technická podpora. Odpověz stručně a česky na tento dotaz: {message}"
            )
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=True)
