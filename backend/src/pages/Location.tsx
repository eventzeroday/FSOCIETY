import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { MapPin, Navigation, CheckCircle2, AlertCircle, Loader2, Leaf, Search } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface SearchResult {
  name: string;
  lat: string;
  lon: string;
  display_name: string;
}

const Location = () => {
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const requestLocation = () => {
    setLocationStatus("requesting");
    setShowSearch(false);

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      setLocationStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const locationData = {
            latitude,
            longitude,
            city: data.city || data.locality,
            country: data.countryName,
          };
          setLocation(locationData);
          localStorage.setItem("userLocation", JSON.stringify(locationData));
        } catch (error) {
          console.log("Could not fetch location details");
        }

        setLocationStatus("granted");
        toast({
          title: "Location accessed",
          description: "Your location has been successfully detected",
        });
      },
      (error) => {
        setLocationStatus("denied");
        let message = "Unable to access your location";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location permission was denied";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information unavailable";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out";
        }
        toast({
          title: "Location error",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not search for location",
        variant: "destructive",
      });
    }
    setIsSearching(false);
  };

  const selectSearchResult = async (result: SearchResult) => {
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      const locationData = {
        latitude,
        longitude,
        city: data.city || data.locality || result.name,
        country: data.countryName,
      };
      setLocation(locationData);
      localStorage.setItem("userLocation", JSON.stringify(locationData));
    } catch (error) {
      const locationData = {
        latitude,
        longitude,
        city: result.name,
        country: "",
      };
      setLocation(locationData);
      localStorage.setItem("userLocation", JSON.stringify(locationData));
    }

    setLocationStatus("granted");
    setSearchResults([]);
    setSearchQuery("");
    toast({
      title: "Location selected",
      description: `${result.name} has been set as your location`,
    });
  };

  const proceedToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-lg animate-slide-up relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-primary">
            <Leaf className="w-6 h-6" />
            <span className="font-semibold">WeFarm</span>
          </div>
        </div>

        <Card className="shadow-card border-0 gradient-card">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {locationStatus === "requesting" ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              ) : locationStatus === "granted" ? (
                <CheckCircle2 className="w-10 h-10 text-primary" />
              ) : locationStatus === "denied" ? (
                <AlertCircle className="w-10 h-10 text-destructive" />
              ) : (
                <MapPin className="w-10 h-10 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl font-semibold">Farm Location</CardTitle>
            <CardDescription className="text-base mt-2">
              Your location helps us identify regional crop diseases and provide accurate weather data
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {locationStatus === "idle" && !showSearch && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Different regions have different disease patterns. Your location helps us provide
                  more accurate diagnoses and region-specific treatment recommendations.
                </p>
                <div className="space-y-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    onClick={requestLocation}
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Detect My Location
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Location
                  </Button>
                </div>
              </div>
            )}

            {locationStatus === "idle" && showSearch && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter city, area or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                    className="flex-1"
                  />
                  <Button onClick={searchLocation} disabled={isSearching}>
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="bg-background rounded-lg border divide-y max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        className="w-full p-3 text-left hover:bg-muted transition-colors flex items-start gap-3"
                        onClick={() => selectSearchResult(result)}
                      >
                        <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{result.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{result.display_name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchResults([]);
                      setSearchQuery("");
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                    onClick={requestLocation}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Auto Detect
                  </Button>
                </div>
              </div>
            )}

            {locationStatus === "requesting" && (
              <div className="text-center py-4">
                <p className="text-muted-foreground animate-pulse-soft">
                  Detecting your location...
                </p>
              </div>
            )}

            {locationStatus === "granted" && location && (
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Location Selected</span>
                  </div>
                  {location.city && (
                    <p className="text-foreground font-semibold text-lg">
                      {location.city}{location.country ? `, ${location.country}` : ""}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      setLocationStatus("idle");
                      setLocation(null);
                      setShowSearch(false);
                    }}
                  >
                    Change Location
                  </Button>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                    onClick={proceedToHome}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {locationStatus === "denied" && (
              <div className="space-y-4">
                <div className="bg-destructive/10 rounded-xl p-4">
                  <p className="text-sm text-destructive">
                    Location access was denied. You can search for your location manually.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      setLocationStatus("idle");
                      setShowSearch(true);
                    }}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search Location
                  </Button>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                    onClick={requestLocation}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Location;
