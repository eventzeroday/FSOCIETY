def predict_disease(crop: str, symptoms: str, weather: dict):
    symptoms = symptoms.lower()
    humidity = weather["humidity"]
    rainfall = weather["rainfall"]
    temperature = weather["temperature"]

    # 🌾 RICE
    if crop.lower() == "rice":
        if "yellow" in symptoms and humidity > 70:
            return {
                "disease": "Rice Blast",
                "risk": "High",
                "confidence": 0.87,
            }

        if "brown" in symptoms and rainfall > 5:
            return {
                "disease": "Brown Spot",
                "risk": "Medium",
                "confidence": 0.78,
            }

    # 🍅 TOMATO
    if crop.lower() == "tomato":
        if "wilting" in symptoms and temperature > 30:
            return {
                "disease": "Bacterial Wilt",
                "risk": "High",
                "confidence": 0.85,
            }

    # 🌽 MAIZE
    if crop.lower() in ["corn", "maize"]:
        if "spots" in symptoms and humidity > 65:
            return {
                "disease": "Leaf Blight",
                "risk": "Medium",
                "confidence": 0.75,
            }

    # ✅ DEFAULT (Healthy)
    return {
        "disease": "Healthy",
        "risk": "Low",
        "confidence": 0.95,
    }
