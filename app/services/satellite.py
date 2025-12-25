import random

def get_ndvi(latitude: float, longitude: float):
    """
    Simulated NDVI based on location.
    Later this will be replaced by real satellite API.
    """

    # Simulate realistic NDVI ranges
    ndvi = round(random.uniform(0.2, 0.85), 2)

    if ndvi > 0.6:
        health = "Healthy vegetation"
    elif ndvi > 0.4:
        health = "Moderate stress"
    else:
        health = "Severe stress"

    return {
        "ndvi": ndvi,
        "vegetation_health": health
    }
