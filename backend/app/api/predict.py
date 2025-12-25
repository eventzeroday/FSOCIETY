from fastapi import APIRouter
from pydantic import BaseModel
from app.services.weather import get_weather
from app.services.satellite import get_ndvi
from app.services.disease_model import predict_disease

router = APIRouter()

class PredictRequest(BaseModel):
    crop: str
    symptoms: str
    latitude: float
    longitude: float
    soil_pH: float = 6.5  # Default value if not provided

@router.post("/predict")
def predict(data: PredictRequest):
    weather = get_weather(data.latitude, data.longitude)
    ndvi_data = get_ndvi(data.latitude, data.longitude)

    disease_result = predict_disease(
        data.crop,
        data.symptoms,
        weather,
        data.soil_pH
    )

    return {
        "crop": data.crop,
        "symptoms": data.symptoms,
        "weather": weather,
        "satellite": ndvi_data,
        "prediction": disease_result["disease"],
        "risk": disease_result["risk"],
        "confidence": disease_result["confidence"],
    }
