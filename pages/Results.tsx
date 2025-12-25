import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft, CloudSun } from "lucide-react";

/* ---------- TYPES ---------- */

interface WeatherInfo {
  temperature: number;
  humidity: number;
  rainfall: number;
  weather: string;
}

interface SatelliteInfo {
  ndvi: number;
  vegetation_health: string;
}

interface PredictionResult {
  crop: string;
  symptoms: string;
  weather: WeatherInfo;
  satellite: SatelliteInfo;
  prediction: string;
  risk: string;
  confidence: number;
  treatment?: string;
  prevention?: string[];
  urgency?: string;
}

/* ---------- COMPONENT ---------- */

const Results = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = localStorage.getItem("predictionResult");

    if (!storedResult) {
      navigate("/chatbot");
      return;
    }

    setResult(JSON.parse(storedResult));
  }, [navigate]);

  if (!result) return null;

  // ✅ NUMERIC RISK SCORE (KEY FIX)
  const riskScore = Math.round(result.confidence * 100);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="max-w-xl w-full shadow-card gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Disease Prediction Result
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Crop */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Crop</p>
            <p className="font-medium">{result.crop}</p>
          </div>

          {/* Symptoms */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Symptoms</p>
            <p className="font-medium">{result.symptoms}</p>
          </div>

          {/* Prediction */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Prediction</p>
            <p className="font-medium text-green-600">
              {result.prediction}
            </p>
          </div>

          {/* Confidence */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="font-medium">{riskScore}%</p>
          </div>

          {/* Weather + NDVI */}
          <div className="bg-primary/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <CloudSun className="w-5 h-5 text-primary" />
              Weather Conditions
            </div>

            <div className="bg-green-50 rounded-lg p-4 space-y-1">
              <div className="font-semibold text-green-700">
                🛰️ Satellite Vegetation Index (NDVI)
              </div>
              <p>
                🌱 NDVI Value: <strong>{result.satellite?.ndvi}</strong>
              </p>
              <p>
                📊 Vegetation Health:{" "}
                <strong>{result.satellite?.vegetation_health}</strong>
              </p>
            </div>

            <p>🌡️ Temperature: {result.weather.temperature} °C</p>
            <p>💧 Humidity: {result.weather.humidity} %</p>
            <p>🌧️ Rainfall: {result.weather.rainfall} mm</p>
            <p>☁️ Condition: {result.weather.weather}</p>
          </div>

          {/* 👉 SHOW HEATMAP BUTTON (FINAL FIX) */}
          <Button
            className="w-full"
            onClick={() => {
              const savedLocation = localStorage.getItem("userLocation");
              if (!savedLocation) {
                alert("Location not found. Please set location first.");
                return;
              }

              const { latitude, longitude } = JSON.parse(savedLocation);

              navigate("/heatmap", {
                state: {
                  latitude,
                  longitude,
                  crop: result.crop,
                  prediction: result.prediction,
                  ndvi: result.satellite?.ndvi,
                  weather: result.weather,
                  riskScore, // ✅ PASS NUMERIC SCORE
                  treatment: result.treatment,
                  prevention: result.prevention,
                  urgency: result.urgency ?? result.risk,
                },
              });
            }}
          >
            Show Disease Risk Heatmap →
          </Button>

          {/* 👉 TREATMENT BUTTON */}
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() =>
              navigate("/treatment", {
                state: {
                  crop: result.crop,
                  prediction: result.prediction,
                  confidence: result.confidence,
                  treatment:
                    result.treatment ??
                    "Consult a local agricultural officer for appropriate treatment.",
                  prevention:
                    result.prevention ?? [
                      "Monitor crops regularly",
                      "Maintain proper irrigation",
                      "Ensure good field hygiene",
                    ],
                  urgency: result.urgency ?? result.risk,
                  weather: result.weather,
                  ndvi: result.satellite?.ndvi,
                },
              })
            }
          >
            Get Treatment & Prevention →
          </Button>

          {/* Start New */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/chatbot")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start New Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
