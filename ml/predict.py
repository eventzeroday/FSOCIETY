import joblib
import numpy as np
import os

# Absolute path to model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")

model = joblib.load(MODEL_PATH)

def predict_risk(data):
    # MUST be 4 features in SAME ORDER as training
    features = np.array([[
        data.temperature,
        data.humidity,
        data.rainfall,
        data.soil_pH
    ]])

    prediction = model.predict(features)[0]

    return "High" if prediction == 1 else "Low"
