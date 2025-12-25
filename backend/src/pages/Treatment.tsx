import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, ShieldCheck } from "lucide-react";

const Treatment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/dashboard");
    return null;
  }

  const {
    crop,
    prediction,
    confidence,
    treatment,
    prevention,
    urgency,
    weather,
    ndvi,
  } = state;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="max-w-xl w-full shadow-card gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Treatment & Prevention
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Crop</p>
            <p className="font-medium">{crop}</p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Disease</p>
            <p className="font-medium">{prediction}</p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="font-medium">{(confidence * 100).toFixed(0)}%</p>
          </div>

          {/* NDVI */}
          <div className="bg-green-50 rounded-lg p-4">
            <p className="font-semibold text-green-700">
              🛰️ Vegetation Health
            </p>
            <p>NDVI: <strong>{ndvi}</strong></p>
          </div>

          {/* Treatment */}
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="font-semibold mb-1">🌿 Recommended Treatment</p>
            <p>{treatment}</p>
          </div>

          {/* Prevention */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="font-semibold mb-1">🛡️ Prevention Steps</p>
            <ul className="list-disc list-inside space-y-1">
              {prevention?.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          {/* Urgency */}
          <div className="bg-red-50 rounded-lg p-4">
            <p className="font-semibold">⚠️ Risk Level</p>
            <p>{urgency}</p>
          </div>

          {/* Back */}
          <Button
            className="w-full mt-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Treatment;
