import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Location from "./pages/Location";
import Weather from "./pages/Weather";
import Satellite from "./pages/Satellite";
import Chatbot from "./pages/Chatbot";
import Results from "./pages/Results";
import Feedback from "./pages/Feedback";
import Dashboard from "./pages/Dashboard";
import Treatment from "./pages/Treatment";
import Heatmap from "./pages/Heatmap";
import NotFound from "./pages/NotFound";


const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/location" element={<Location />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/satellite" element={<Satellite />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/results" element={<Results />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/treatment" element={<Treatment />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
