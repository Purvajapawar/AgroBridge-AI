from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os
import pickle
import random

app = Flask(__name__)

# ================= LOAD MODELS =================

# Load product classifier model
try:
    product_model = tf.keras.models.load_model("product_classifier.keras")
    class_names = ["potato", "tomato", "wheat"]
    print("Product classifier model loaded successfully")
except Exception as e:
    print(f"Error loading product model: {e}")
    product_model = None
    class_names = ["potato", "tomato", "wheat"]

# Load price prediction models (if available)
try:
    with open("le_commodity.pkl", "rb") as f:
        le_commodity = pickle.load(f)
    with open("le_market.pkl", "rb") as f:
        le_market = pickle.load(f)
    with open("le_state.pkl", "rb") as f:
        le_state = pickle.load(f)
    print("Label encoders loaded successfully")
except Exception as e:
    print(f"Error loading label encoders: {e}")
    le_commodity = None
    le_market = None
    le_state = None

try:
    with open("price_model.pkl", "rb") as f:
        price_model = pickle.load(f)
    print("Price model loaded successfully")
except Exception as e:
    print(f"Error loading price model: {e}")
    price_model = None

# ================= ROOT ROUTE =================

@app.route("/")
def home():
    return jsonify({
        "service": "AgroBridgeAI ML Service",
        "status": "running",
        "endpoints": ["/predict-price", "/detect-quality", "/predict-product"]
    })

# ================= PRICE PREDICTION ROUTE =================

@app.route("/predict-price", methods=["POST"])
def predict_price():
    try:
        data = request.json
        
        crop_type = data.get("cropType", "")
        expected_price = data.get("expectedPrice", 2000)
        location = data.get("location", "")
        
        # Mock AI prediction (in production, use actual ML model)
        # AI predicts market price based on various factors
        
        # Base prediction from expected price
        predicted_price = int(expected_price * random.uniform(1.05, 1.25))
        
        # Adjust based on crop type
        crop_multipliers = {
            "wheat": 1.15,
            "rice": 1.20,
            "corn": 1.10,
            "soybean": 1.18,
            "cotton": 1.22,
            "sugarcane": 1.08,
            "potato": 1.12,
            "tomato": 1.25,
            "onion": 1.30,
            "mustard": 1.14
        }
        
        multiplier = crop_multipliers.get(crop_type.lower(), 1.15)
        predicted_price = int(expected_price * multiplier)
        
        # Calculate suggested price (slightly lower than predicted for better sales)
        suggested_price = int(predicted_price * 0.97)
        
        # Determine recommendation
        if predicted_price > expected_price:
            recommendation = "increase"
            diff = predicted_price - expected_price
        else:
            recommendation = "hold"
            diff = 0
        
        return jsonify({
            "success": True,
            "predicted_price": predicted_price,
            "suggested_price": suggested_price,
            "recommendation": recommendation,
            "diff": diff,
            "confidence": random.randint(75, 95)
        })
        
    except Exception as e:
        print("Price Prediction Error:", str(e))
        return jsonify({
            "success": False,
            "message": str(e)
        })

# ================= QUALITY DETECTION ROUTE =================

@app.route("/detect-quality", methods=["POST"])
def detect_quality():
    try:
        if "file" not in request.files:
            return jsonify({
                "success": False,
                "message": "No file received"
            })

        file = request.files["file"]

        # Save temporarily
        file_path = os.path.join("temp.jpg")
        file.save(file_path)

        # Mock AI quality detection
        # In production, use a trained CNN model for grain quality detection
        
        # Simulate AI analysis
        grade = random.choice(["A", "A", "A", "B", "B", "C"])
        broken_percentage = random.randint(1, 8)
        color_score = round(random.uniform(7.0, 9.5), 1)
        
        # Determine grade based on metrics
        if broken_percentage <= 3 and color_score >= 8.0:
            grade = "A"
        elif broken_percentage <= 6 and color_score >= 7.0:
            grade = "B"
        else:
            grade = "C"
        
        return jsonify({
            "success": True,
            "grade": grade,
            "broken_percentage": broken_percentage,
            "color_score": color_score,
            "confidence": random.randint(70, 95)
        })

    except Exception as e:
        print("Quality Detection Error:", str(e))
        return jsonify({
            "success": False,
            "message": str(e)
        })

# ================= PRODUCT CLASSIFICATION ROUTE =================

@app.route("/predict-product", methods=["POST"])
def predict_product():
    try:
        if "file" not in request.files:
            return jsonify({
                "success": False,
                "message": "No file received"
            })

        file = request.files["file"]

        # Save temporarily
        file_path = os.path.join("temp.jpg")
        file.save(file_path)

        if product_model is None:
            # Return mock prediction if model not loaded
            return jsonify({
                "success": True,
                "product": random.choice(class_names),
                "confidence": random.randint(70, 90)
            })

        # Resize to match training
        img = image.load_img(file_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0

        predictions = product_model.predict(img_array)
        confidence = float(np.max(predictions) * 100)
        predicted_class = class_names[np.argmax(predictions)]

        return jsonify({
            "success": True,
            "product": predicted_class,
            "confidence": round(confidence, 2)
        })

    except Exception as e:
        print("Prediction Error:", str(e))
        return jsonify({
            "success": False,
            "message": str(e)
        })

# ================= HEALTH CHECK =================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "models_loaded": {
            "product_classifier": product_model is not None,
            "price_model": price_model is not None
        }
    })

# ================= RUN SERVER =================

if __name__ == "__main__":
    app.run(port=5001, debug=True)

