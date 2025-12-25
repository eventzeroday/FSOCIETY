import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Leaf, Star, MessageSquare, CheckCircle } from "lucide-react";

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save feedback
    const feedbackData = {
      rating,
      feedback,
      date: new Date().toISOString()
    };
    
    const existingFeedback = JSON.parse(localStorage.getItem("userFeedback") || "[]");
    existingFeedback.push(feedbackData);
    localStorage.setItem("userFeedback", JSON.stringify(existingFeedback));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Thank you!",
      description: "Your feedback has been submitted successfully",
    });
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const startNewDiagnosis = () => {
    // Clear current session data
    localStorage.removeItem("chatbotAnswers");
    navigate("/location");
  };

  const username = localStorage.getItem("username") || "Farmer";

  if (isSubmitted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card border-0 gradient-card text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-8">
              Your feedback helps us improve our disease detection system for farmers everywhere.
            </p>
            <div className="space-y-3">
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={goToDashboard}
              >
                View Dashboard & History
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={startNewDiagnosis}
              >
                Start New Diagnosis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">WeFarm</h1>
              <p className="text-xs text-muted-foreground">Feedback</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            Welcome, {username}
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Card className="shadow-card border-0 gradient-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">How was your experience?</CardTitle>
            <CardDescription>
              Your feedback helps us improve our crop disease detection system
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <Label className="text-sm font-medium mb-3 block">Rate your experience</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/30"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Feedback Text */}
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm font-medium">
                Additional comments (optional)
              </Label>
              <Textarea
                id="feedback"
                placeholder="Tell us about your experience with the disease detection..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="resize-none bg-background/50"
              />
            </div>

            {/* Submit Button */}
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Feedback"
              )}
            </Button>

            {/* Skip Button */}
            <Button
              variant="ghost"
              className="w-full"
              onClick={goToDashboard}
            >
              Skip & Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
