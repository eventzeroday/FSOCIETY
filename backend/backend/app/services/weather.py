import requests
import os

OPENWEATHER_API_KEY = os.getenv("4117b0db8d3ae6e7567d46461ffc1b40")


def get_weather(latitude: float, longitude: float):
    url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?lat={latitude}&lon={longitude}"
        f"&appid={"4117b0db8d3ae6e7567d46461ffc1b40"}&units=metric"
    )

    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    return {
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "rainfall": data.get("rain", {}).get("1h", 0),
        "weather": data["weather"][0]["description"],
    }
