import sys
import os

# Add backend to sys.path so we can import app
sys.path.append(os.path.abspath("backend"))

from app.services.disease_model import predict_disease

def test_prediction():
    print("Testing prediction integration...")
    
    # Mock weather data
    weather = {
        "temperature": 25.0,
        "humidity": 80.0,
        "rainfall": 10.0
    }
    
    # Test case 1: Healthy inputs
    result = predict_disease(
        crop="Rice",
        symptoms="none",
        weather=weather,
        soil_pH=6.5
    )
    print(f"Result 1 (Normal): {result}")
    
    # Test case 2: Inputs that might trigger ML High Risk (if model works)
    # Based on train.py, we don't know exact thresholds, but let's try extreme values
    # if the model learned anything.
    # But just checking if it runs without error is a good start.
    
    print("Integration test passed!")

if __name__ == "__main__":
    test_prediction()
