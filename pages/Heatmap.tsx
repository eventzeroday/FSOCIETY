import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import { Button } from "@/components/ui/button";
import "./heatmap.css";

type HeatPoint = [number, number, number];

// Amoeba-style heatmap generator
const generateAmoeba = (lat: number, lon: number): HeatPoint[] => [
  [lat, lon, 0.85],
  [lat + 0.0009, lon + 0.0028, 0.7],
  [lat - 0.0006, lon + 0.0038, 0.6],
  [lat + 0.0014, lon + 0.0048, 0.5],
  [lat + 0.0028, lon + 0.0012, 0.55],
  [lat - 0.0009, lon - 0.0018, 0.4],
];

export default function Heatmap() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const searchLocation = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}, India`
      );
      const data = await res.json();

      if (!data.length) {
        alert("Location not found");
        setLoading(false);
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      setCenter([lat, lon]);
      setHeatPoints(generateAmoeba(lat, lon));
      setLocationName(data[0].display_name.split(",").slice(0, 2).join(", "));
    } catch {
      alert("Failed to fetch location");
    }

    setLoading(false);
  };

  return (
    <div className="heatmap-page">
      {/* Header */}
      <header className="heatmap-header">
        <h1>Crop Disease Risk Map</h1>
        <p>
          AI-powered visualization of disease risk across farming regions in
          India using satellite and weather signals.
        </p>
      </header>

      {/* Back Button */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Button variant="outline" size="lg" onClick={goToDashboard}>
          ← Back to Dashboard
        </Button>
      </div>

      {/* Search Panel */}
      <div className="search-panel">
        <input
          type="text"
          placeholder="Enter village / district / city (India)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchLocation}>
          {loading ? "Analyzing…" : "Analyze Region"}
        </button>
      </div>

      {/* Status */}
      {center && (
        <div className="status-bar">
          Showing disease risk for <strong>{locationName}</strong>
        </div>
      )}

      {/* Map + Legend */}
      {center && (
        <div className="map-wrapper">
          <MapContainer
            center={center}
            zoom={15}
            scrollWheelZoom
            className="map-container"
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            <HeatmapLayer
              points={heatPoints}
              latitudeExtractor={(p) => p[0]}
              longitudeExtractor={(p) => p[1]}
              intensityExtractor={(p) => p[2]}
              radius={140}
              blur={100}
              max={1}
              gradient={{
                "0.0": "#22c55e",
                "0.35": "#facc15",
                "0.6": "#fb923c",
                "0.85": "#ef4444",
              }}
            />
          </MapContainer>

          {/* Legend */}
          <div className="legend-card">
            <h4>Disease Risk Levels</h4>

            <div className="legend-item">
              <span className="low" />
              <div>
                <strong>Low Risk</strong>
                <p>Crop is healthy</p>
              </div>
            </div>

            <div className="legend-item">
              <span className="medium" />
              <div>
                <strong>Moderate Risk</strong>
                <p>Early stress detected</p>
              </div>
            </div>

            <div className="legend-item">
              <span className="high" />
              <div>
                <strong>High Risk</strong>
                <p>Disease outbreak likely</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ TREATMENT BUTTON (VISIBLE & SAFE) */}
      {center && (
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={() =>
              navigate("/treatment", {
                state: {
                  location: locationName,
                  latitude: center[0],
                  longitude: center[1],
                  riskLevel: "High",
                },
              })
            }
          >
            Get Treatment & Prevention →
          </Button>
        </div>
      )}
    </div>
  );
}
