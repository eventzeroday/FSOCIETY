import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Cloud, Droplets, Wind, Thermometer, ArrowRight, MapPin, Loader2, Sun, CloudRain } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

const Weather = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const savedLocation = localStorage.getItem("userLocation");
    if (!savedLocation) {
      navigate("/location");
      return;
    }

    const locationData = JSON.parse(savedLocation);
    setLocation(locationData);
    fetchWeather(locationData.latitude, locationData.longitude);
  }, [navigate]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      // Using Open-Meteo API (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature,pressure_msl,visibility&timezone=auto`
      );
      const data = await response.json();
      
      const weatherCode = data.current.weather_code;
      const condition = getWeatherCondition(weatherCode);
      
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        condition: condition,
        icon: getWeatherIcon(weatherCode),
        feelsLike: Math.round(data.current.apparent_temperature),
        pressure: Math.round(data.current.pressure_msl),
        visibility: Math.round(data.current.visibility / 1000),
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Fallback mock data
      setWeather({
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        feelsLike: 30,
        pressure: 1013,
        visibility: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 49) return "Foggy";
    if (code <= 59) return "Drizzle";
    if (code <= 69) return "Rain";
    if (code <= 79) return "Snow";
    if (code <= 99) return "Thunderstorm";
    return "Unknown";
  };

  const getWeatherIcon = (code: number): string => {
    if (code === 0) return "clear";
    if (code <= 3) return "partly-cloudy";
    if (code <= 59) return "cloudy";
    if (code <= 79) return "rain";
    return "storm";
  };

  const getWeatherEmoji = (icon: string): React.ReactNode => {
    switch (icon) {
      case "clear": return <Sun className="w-16 h-16 text-yellow-500" />;
      case "partly-cloudy": return <Cloud className="w-16 h-16 text-blue-400" />;
      case "cloudy": return <Cloud className="w-16 h-16 text-gray-400" />;
      case "rain": return <CloudRain className="w-16 h-16 text-blue-500" />;
      default: return <Cloud className="w-16 h-16 text-gray-500" />;
    }
  };

  const proceedToSatellite = () => {
    navigate("/satellite");
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Fetching weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-4xl mx-auto pt-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <Leaf className="w-6 h-6" />
            <span className="font-semibold">WeFarm</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Weather Conditions</h1>
          {location && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{location.city}, {location.country}</span>
            </div>
          )}
        </div>

        {/* Main Weather Card */}
        <Card className="shadow-card border-0 gradient-card mb-6">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                {weather && getWeatherEmoji(weather.icon)}
                <p className="text-lg text-muted-foreground mt-2">{weather?.condition}</p>
              </div>
              <div className="text-center md:text-left">
                <div className="text-6xl font-bold text-foreground">
                  {weather?.temperature}°C
                </div>
                <p className="text-muted-foreground">
                  Feels like {weather?.feelsLike}°C
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card border-0 gradient-card">
            <CardContent className="py-6 text-center">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{weather?.humidity}%</p>
              <p className="text-sm text-muted-foreground">Humidity</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 gradient-card">
            <CardContent className="py-6 text-center">
              <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{weather?.windSpeed} km/h</p>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 gradient-card">
            <CardContent className="py-6 text-center">
              <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{weather?.pressure} hPa</p>
              <p className="text-sm text-muted-foreground">Pressure</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 gradient-card">
            <CardContent className="py-6 text-center">
              <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{weather?.visibility} km</p>
              <p className="text-sm text-muted-foreground">Visibility</p>
            </CardContent>
          </Card>
        </div>

        {/* Agriculture Advisory */}
        <Card className="shadow-card border-0 gradient-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Agriculture Advisory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {weather && weather.humidity > 70 
                ? "High humidity detected. Monitor crops for fungal diseases like blight and mildew. Ensure proper ventilation in fields."
                : weather && weather.humidity < 40
                ? "Low humidity conditions. Consider irrigation to prevent water stress on crops."
                : "Weather conditions are favorable for most crops. Continue regular monitoring for any signs of disease."}
            </p>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            variant="gradient"
            size="lg"
            className="gap-2"
            onClick={proceedToSatellite}
          >
            View Satellite Imagery
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Weather;
