import sys
import os

# Add the parent directory to sys.path to allow importing from ml
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

try:
    from ml.predict import predict_risk
except ImportError:
    predict_risk = None
    print("Warning: Could not import ml.predict. ML model will not be used.")

class ModelInput:
    def __init__(self, temperature, humidity, rainfall, soil_pH):
        self.temperature = temperature
        self.humidity = humidity
        self.rainfall = rainfall
        self.soil_pH = soil_pH

def predict_disease(crop: str, symptoms: str, weather: dict, soil_pH: float = 6.5):
    symptoms = symptoms.lower()
    humidity = weather["humidity"]
    rainfall = weather["rainfall"]
    temperature = weather["temperature"]

    # Use ML Model for Risk Assessment
    ml_risk = "Unknown"
    if predict_risk:
        try:
            input_data = ModelInput(temperature, humidity, rainfall, soil_pH)
            ml_risk = predict_risk(input_data)
        except Exception as e:
            print(f"Error in ML prediction: {e}")
            ml_risk = "Error"

    # Rule-based Disease Prediction
    disease_info = {
        "disease": "Healthy",
        "risk": "Low",
        "confidence": 0.95,
    }

    # 🌾 RICE
    if crop.lower() == "rice":
        if "yellow" in symptoms and humidity > 70:
            disease_info = {
                "disease": "Rice Blast",
                "risk": "High",
                "confidence": 0.87,
            }
        elif "brown" in symptoms and rainfall > 5:
            disease_info = {
                "disease": "Brown Spot",
                "risk": "Medium",
                "confidence": 0.78,
            }

    # 🍅 TOMATO
    elif crop.lower() == "tomato":
        if "wilting" in symptoms and temperature > 30:
            disease_info = {
                "disease": "Bacterial Wilt",
                "risk": "High",
                "confidence": 0.85,
            }

    # 🌽 MAIZE
    elif crop.lower() in ["corn", "maize"]:
        if "spots" in symptoms and humidity > 65:
            disease_info = {
                "disease": "Leaf Blight",
                "risk": "Medium",
                "confidence": 0.75,
            }

    # Override Risk with ML Model if available and High
    if ml_risk == "High":
        disease_info["risk"] = "High"
        # Adjust confidence if ML detects high risk but rules didn't?
        # For now, just trust the ML risk for the risk field.

    return disease_info
