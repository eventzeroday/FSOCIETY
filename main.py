from fastapi import FastAPI
from pydantic import BaseModel
from ml.predict import predict_risk

app = FastAPI(title="Plant Disease Risk Backend")

class PredictionInput(BaseModel):
    temperature: float
    humidity: float
    rainfall: float
    soil_pH: float

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/predict")
def predict(data: PredictionInput):
    risk = predict_risk(data)
    return {"risk_level": risk}
