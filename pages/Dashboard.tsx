import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Leaf,
  Plus,
  LogOut,
  Trash2,
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
} from "lucide-react";

import { MapContainer, TileLayer } from "react-leaflet";

/* ---------------- TYPES ---------------- */

interface DiagnosisEntry {
  id: number;
  date: string;
  disease: string;
  severity: "low" | "medium" | "high";
  confidence: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  feelsLike: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

/* ---------------- COMPONENT ---------------- */

const Dashboard = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState<DiagnosisEntry[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Fetch History from PHP Database
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost/php_backend/get_history.php?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHistory(data.history.map((item: any) => ({
              id: item.id,
              date: item.date,
              disease: item.disease,
              severity: item.risk ? item.risk.toLowerCase() : "low",
              confidence: item.confidence
            })));
          }
        })
        .catch(err => console.error("History fetch error:", err));
    } else {
      // Fallback to localStorage if no user ID (legacy support)
      const savedHistory = localStorage.getItem("diagnosisHistory");
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    }

    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      const loc = JSON.parse(savedLocation);
      setLocation(loc);
      fetchWeather(loc.latitude, loc.longitude);
    } else {
      setWeatherLoading(false);
    }
  }, [navigate]);

  /* ---------------- WEATHER ---------------- */

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&timezone=auto`
      );
      const data = await res.json();

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        feelsLike: Math.round(data.current.apparent_temperature),
        condition: "Clear Sky",
        icon: "clear",
      });
    } catch {
      console.error("Weather fetch failed");
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherIcon = () =>
    weather?.icon === "clear" ? (
      <Sun className="w-10 h-10 text-yellow-500" />
    ) : (
      <Cloud className="w-10 h-10 text-blue-400" />
    );

  /* ---------------- HELPERS ---------------- */

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const startNewDiagnosis = () => {
    navigate("/weather");
  };

  const goToHome = () => {
    navigate("/");
  };

  const clearHistory = () => {
    localStorage.removeItem("diagnosisHistory");
    setHistory([]);
  };

  const username = localStorage.getItem("username") || "Farmer";

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen gradient-hero">
      {/* HEADER */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-semibold">WeFarm</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* WELCOME */}
        <Card className="mb-6 gradient-card">
          <CardContent className="py-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {username}!
              </h2>
              <p className="text-muted-foreground">
                Start a new diagnosis or review previous results.
              </p>
            </div>
            <Button variant="gradient" size="lg" onClick={startNewDiagnosis}>
              <Plus className="w-5 h-5 mr-2" />
              New Diagnosis
            </Button>
          </CardContent>
        </Card>

        {/* WEATHER + SATELLITE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* WEATHER */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
              {weatherLoading ? (
                <p>Loading weather...</p>
              ) : weather ? (
                <>
                  <div className="flex gap-4 items-center mb-4">
                    {getWeatherIcon()}
                    <div>
                      <div className="text-3xl font-bold">
                        {weather.temperature}°C
                      </div>
                      <div className="text-muted-foreground">
                        {weather.condition}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Droplets className="mx-auto mb-1" />
                      {weather.humidity}%
                    </div>
                    <div>
                      <Wind className="mx-auto mb-1" />
                      {weather.windSpeed} km/h
                    </div>
                    <div>
                      <Thermometer className="mx-auto mb-1" />
                      {weather.feelsLike}°C
                    </div>
                  </div>
                </>
              ) : (
                <p>No weather data</p>
              )}
            </CardContent>
          </Card>

          {/* SATELLITE */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Satellite View</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <MapContainer
                center={[
                  location?.latitude || 10.7867,
                  location?.longitude || 76.6548,
                ]}
                zoom={13}
                style={{ height: "260px", width: "100%", borderRadius: "12px" }}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles © Esri"
                />
              </MapContainer>
            </CardContent>
          </Card>
        </div>

        {/* HISTORY */}
        <Card className="gradient-card">
          <CardHeader className="flex justify-between flex-row">
            <CardTitle>Previous Assessments</CardTitle>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No previous assessments
              </p>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 mb-3 bg-background/50 rounded-lg flex justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{entry.disease}</h4>
                    <p className="text-sm text-muted-foreground">
                      {entry.date}
                    </p>
                  </div>
                  <span className="text-sm">
                    {entry.confidence}% confidence
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ✅ GO TO HOME BUTTON */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" onClick={goToHome}>
            Back to Home
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
