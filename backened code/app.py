import os
import base64
import uuid
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from urllib.parse import quote_plus

# Initialize Flask app
app = Flask(__name__)

# Enable CORS globally for all routes
CORS(app)

# Configurations
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# MongoDB setup (replace with your credentials)
username = "shraddhaadhav99_db_user"
password = "godisgreat"
encoded_password = quote_plus(password)
uri = f"mongodb+srv://{username}:{encoded_password}@cluster0.jpsfz1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = MongoClient(uri)
    db = client['geodata_db']
    collection = db['uploads']
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB.")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print("Received a form submission.")

        description = request.form.get('description')
        image_file = request.files.get('image')
        audio_data_uri = request.form.get('audioData')
        image_path = None
        audio_path = None
        geotags = {}
        extracted_text = None

        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])

        if image_file and allowed_file(image_file.filename):
            filename = f"{uuid.uuid4()}_{secure_filename(image_file.filename)}"
            full_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(full_image_path)
            image_path = filename

        if audio_data_uri:
            try:
                header, encoded = audio_data_uri.split(",", 1)
                audio_data = base64.b64decode(encoded)
                audio_filename = f"audio_{uuid.uuid4()}.webm"
                full_audio_path = os.path.join(app.config['UPLOAD_FOLDER'], audio_filename)
                with open(full_audio_path, 'wb') as f:
                    f.write(audio_data)
                audio_path = os.path.basename(full_audio_path)
            except Exception as e:
                print(f"Error saving audio file: {e}")
                audio_path = None

        report_data = {
            "description": description,
            "image_path": image_path,
            "audio_path": audio_path,
            "geotags": geotags,
            "extracted_text": extracted_text,
            "timestamp": datetime.utcnow()
        }

        result = collection.insert_one(report_data)

        # Convert ObjectId to string for JSON serialization
        report_data["_id"] = str(result.inserted_id)

        print("Successfully stored report in MongoDB.")
        return jsonify({"message": "Report submitted successfully", "data": report_data}), 200

    except Exception as e:
        print(f"Exception in upload_file: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500



@app.route('/')
def index():
    return jsonify({"message": "Flask backend is running ✅"})

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
