import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Satellite as SatelliteIcon, ArrowRight, MapPin, Loader2, Layers, Eye, Calendar } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

const Satellite = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<"natural" | "ndvi" | "moisture">("natural");

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
    
    // Simulate loading satellite imagery
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [navigate]);

  const proceedToChatbot = () => {
    navigate("/chatbot");
  };

  const getSatelliteImageUrl = () => {
    if (!location) return "";
    // Using OpenStreetMap tiles as a placeholder for satellite imagery
    // In production, you would use services like Google Earth Engine, Sentinel Hub, etc.
    const zoom = 13;
    const lat = location.latitude;
    const lon = location.longitude;
    
    // Calculate tile coordinates
    const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    // Using ESRI World Imagery for satellite view
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`;
  };

  const getViewOverlayColor = () => {
    switch (selectedView) {
      case "ndvi": return "bg-green-500/30";
      case "moisture": return "bg-blue-500/30";
      default: return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading satellite imagery...</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Satellite Imagery</h1>
          {location && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{location.city}, {location.country}</span>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={selectedView === "natural" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("natural")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Natural
          </Button>
          <Button
            variant={selectedView === "ndvi" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("ndvi")}
          >
            <Layers className="w-4 h-4 mr-2" />
            NDVI
          </Button>
          <Button
            variant={selectedView === "moisture" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("moisture")}
          >
            <Layers className="w-4 h-4 mr-2" />
            Moisture
          </Button>
        </div>

        {/* Satellite Image Card */}
        <Card className="shadow-card border-0 gradient-card mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted">
              {/* Grid of satellite tiles to cover the area */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
                {[...Array(6)].map((_, i) => {
                  if (!location) return null;
                  const zoom = 14;
                  const lat = location.latitude;
                  const lon = location.longitude;
                  const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
                  const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
                  const offsetX = (i % 3) - 1;
                  const offsetY = Math.floor(i / 3);
                  return (
                    <img
                      key={i}
                      src={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y + offsetY}/${x + offsetX}`}
                      alt="Satellite view"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  );
                })}
              </div>
              {/* Overlay for different views */}
              <div className={`absolute inset-0 ${getViewOverlayColor()} pointer-events-none`} />
              {/* Location marker */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg animate-pulse" />
              </div>
              {/* View indicator */}
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                <span className="flex items-center gap-2">
                  <SatelliteIcon className="w-4 h-4" />
                  {selectedView === "natural" ? "Natural Color" : selectedView === "ndvi" ? "Vegetation Index" : "Soil Moisture"}
                </span>
              </div>
              {/* Coordinates */}
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                {location?.latitude.toFixed(4)}°, {location?.longitude.toFixed(4)}°
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card border-0 gradient-card">
            <CardContent className="py-4 text-center">
              <SatelliteIcon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Sentinel-2</p>
              <p className="text-xs text-muted-foreground">Data Source</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 gradient-card">
            <CardContent className="py-4 text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{new Date().toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">Last Updated</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 gradient-card">
            <CardContent className="py-4 text-center">
              <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">10m</p>
              <p className="text-xs text-muted-foreground">Resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Card */}
        <Card className="shadow-card border-0 gradient-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Imagery Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {selectedView === "natural" 
                ? "Natural color imagery shows the actual appearance of your farmland. Use this to identify visible crop stress, bare patches, or water logging."
                : selectedView === "ndvi"
                ? "NDVI (Normalized Difference Vegetation Index) highlights vegetation health. Green areas indicate healthy vegetation, while yellow/red areas may indicate stress."
                : "Soil moisture analysis helps identify areas with water stress or excess moisture. Blue indicates higher moisture content."}
            </p>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            variant="gradient"
            size="lg"
            className="gap-2"
            onClick={proceedToChatbot}
          >
            Continue to Disease Assessment
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Satellite;
