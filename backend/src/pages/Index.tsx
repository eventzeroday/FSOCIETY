import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "leaflet/dist/leaflet.css";
import {
  Leaf,
  Cloud,
  Satellite,
  Brain,
  Users,
  Bell,
  Sprout,
  Database,
  Microscope,
  TrendingUp,
  CloudRain,
  ArrowRight,
  Droplets,
  Wind,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const hasLocation = localStorage.getItem("userLocation") !== null;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (!hasLocation) {
      navigate("/location");
    }
  }, [isLoggedIn, hasLocation, navigate]);

  const features = [
    {
      icon: Cloud,
      title: "Real-Time Weather",
      description: "Live weather data integration with hyperlocal forecasting for precise field-level predictions.",
    },
    {
      icon: Satellite,
      title: "Satellite Imagery",
      description: "Multi-spectral satellite analysis to detect crop stress before visible symptoms appear.",
    },
    {
      icon: Brain,
      title: "AI Predictions",
      description: "Machine learning models trained on decades of agricultural data for accurate disease forecasting.",
    },
    {
      icon: Users,
      title: "Farmer Network",
      description: "Crowdsourced observations from local farmers to validate and enhance prediction accuracy.",
    },
    {
      icon: Bell,
      title: "Early Alerts",
      description: "Automated notifications sent 48-72 hours before predicted outbreak conditions.",
    },
    {
      icon: Sprout,
      title: "Treatment Plans",
      description: "AI-recommended interventions tailored to your specific crops, region, and conditions.",
    },
  ];

  const steps = [
    {
      icon: Database,
      step: "Step 1",
      title: "Data Collection",
      description: "We gather weather data, satellite imagery, and farmer observations continuously.",
    },
    {
      icon: Microscope,
      step: "Step 2",
      title: "Analysis",
      description: "AI models analyze patterns to identify disease-favorable conditions.",
    },
    {
      icon: TrendingUp,
      step: "Step 3",
      title: "Prediction",
      description: "Risk scores are calculated for each field and disease type.",
    },
    {
      icon: CloudRain,
      step: "Step 4",
      title: "Alert & Act",
      description: "Receive timely alerts with actionable treatment recommendations.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Farms" },
    { value: "2M+", label: "Acres Protected" },
    { value: "95%", label: "Prediction Accuracy" },
    { value: "$40M+", label: "Crop Loss Prevented" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            AI-Powered Crop Protection
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Predict Crop Diseases
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold text-accent mb-6">
            Before They Strike
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Combine weather data, satellite imagery, and AI predictions to protect your crops. 
            Get early warnings and actionable insights to minimize crop loss.
          </p>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="gap-2 px-8"
              onClick={() => navigate("/weather")}
            >
              <Microscope className="w-5 h-5" />
              Identify Crop Disease
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-5xl mx-auto mt-20 relative z-10">
          <div className="text-center text-muted-foreground text-sm mb-6">
            Trusted by farmers across the globe
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl py-8 px-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to protect your crops and maximize yields
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card hover:shadow-lg transition-shadow border-border">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From data collection to actionable insights, our platform works around the clock to keep your crops protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-card border-border text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-sm text-primary font-medium mb-2">{step.step}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm text-primary font-medium mb-2">DASHBOARD</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Command Center
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Monitor all your fields in real-time with our intuitive dashboard. Get instant insights and take action before problems escalate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-lg mx-auto">
            {/* Weather Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Weather Conditions</h3>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Live</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">🌤️</div>
                  <div>
                    <div className="text-4xl font-bold text-foreground">24°C</div>
                    <div className="text-muted-foreground text-sm">Partly Cloudy</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Droplets className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                    <div className="text-xs text-muted-foreground">Humidity</div>
                    <div className="font-semibold text-foreground">68%</div>
                  </div>
                  <div className="text-center">
                    <Wind className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                    <div className="text-xs text-muted-foreground">Wind</div>
                    <div className="font-semibold text-foreground">12 km/h</div>
                  </div>
                  <div className="text-center">
                    <CloudRain className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                    <div className="text-xs text-muted-foreground">Rain</div>
                    <div className="font-semibold text-foreground">15%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            About WeFarm
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            WeFarm is dedicated to empowering farmers with cutting-edge AI technology for crop disease detection and prevention. 
            Our mission is to help farmers protect their crops, maximize yields, and ensure food security through early disease identification.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
              <p className="text-sm text-muted-foreground">
                To revolutionize agriculture through AI-powered disease detection and prevention systems.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Our Team</h3>
              <p className="text-sm text-muted-foreground">
                A passionate team of agricultural scientists, AI engineers, and farmers working together.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Our Technology</h3>
              <p className="text-sm text-muted-foreground">
                State-of-the-art machine learning models trained on extensive agricultural datasets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
