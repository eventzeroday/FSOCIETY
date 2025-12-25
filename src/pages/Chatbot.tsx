import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Leaf, Bot, User, ArrowRight, LogOut } from "lucide-react";

interface Message {
  id: number;
  type: "bot" | "user";
  content: string;
  options?: string[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Hello! I'm WeFarm Assistant. What type of crop are you growing?",
    options: ["Rice", "Wheat", "Corn/Maize", "Cotton", "Tomato", "Potato", "Sugarcane", "Other"],
  },
  {
    id: 2,
    question: "Which part of the plant is showing symptoms?",
    options: ["Leaves", "Stems", "Roots", "Fruits/Grains", "Flowers", "Entire plant"],
  },
  {
    id: 3,
    question: "What color changes have you noticed on the affected parts?",
    options: ["Yellow/Yellowing", "Brown spots", "Black spots", "White patches", "Red/Purple", "No color change"],
  },
  {
    id: 4,
    question: "Describe the texture or appearance of the affected area:",
    options: ["Wilting/Drooping", "Curling leaves", "Powdery coating", "Wet/Slimy rot", "Dry/Crispy", "Holes or eaten areas"],
  },
  {
    id: 5,
    question: "How long have you noticed these symptoms?",
    options: ["Just appeared (1-2 days)", "Less than a week", "1-2 weeks", "More than 2 weeks"],
  },
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (messages.length === 0) {
      addBotMessage(questions[0].question, questions[0].options);
    }
  }, [navigate, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const addBotMessage = (content: string, options?: string[]) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "bot", content, options },
    ]);
  };

  // 🔹 SEND DATA TO BACKEND
  const sendToBackend = async (finalAnswers: string[]) => {
    try {
      // Get location from localStorage if available
      const savedLocation = localStorage.getItem("userLocation");
      let lat = 19.07;
      let lon = 72.87;
      
      if (savedLocation) {
        const loc = JSON.parse(savedLocation);
        lat = loc.latitude;
        lon = loc.longitude;
      }

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop: finalAnswers[0],
          symptoms: finalAnswers.slice(1).join(", "),
          latitude: lat,
          longitude: lon,
        }),
      });

      const data = await response.json();
      localStorage.setItem("predictionResult", JSON.stringify(data));

      // 🔹 SAVE TO PHP DATABASE
      const userId = localStorage.getItem("userId");
      if (userId) {
        await fetch("http://localhost/php_backend/save_diagnosis.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            crop: data.crop,
            symptoms: data.symptoms,
            prediction: data.prediction,
            risk: data.risk,
            confidence: data.confidence
          }),
        });
      }

    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const handleOptionSelect = (option: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", content: option },
    ]);

    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        addBotMessage(questions[nextIndex].question, questions[nextIndex].options);
      } else {
        localStorage.setItem("chatbotAnswers", JSON.stringify(newAnswers));
        addBotMessage("Thank you! Analyzing your responses...");

        // 🔥 BACKEND CALL
        sendToBackend(newAnswers);

        setTimeout(() => {
          navigate("/results");
        }, 1500);
      }
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const username = localStorage.getItem("username") || "Farmer";
  const isComplete =
    currentQuestionIndex >= questions.length - 1 &&
    answers.length >= questions.length;

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">WeFarm</h1>
              <p className="text-xs text-muted-foreground">Disease Detection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {username}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        <Card className="h-[calc(100vh-200px)] flex flex-col shadow-card border-0 gradient-card">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              Crop Disease Assessment
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Answer a few questions to help us identify the disease
            </p>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className="max-w-[80%]">
                      {message.type === "bot" ? (
                        <div className="space-y-3">
                          <div className="bg-secondary/50 rounded-2xl px-4 py-3">
                            <p>{message.content}</p>
                          </div>
                          {message.options &&
                            !isComplete &&
                            index === messages.length - 1 && (
                              <div className="flex flex-wrap gap-2">
                                {message.options.map((option) => (
                                  <Button
                                    key={option}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOptionSelect(option)}
                                  >
                                    {option}
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                ))}
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2">
                          {message.content}
                        </div>
                      )}
                    </div>
                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
