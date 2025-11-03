// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Kiosks from "./pages/Kiosks";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/Admin";
import KioskDetailPage from "./pages/KioskDetail";

// We don't need to import SetupDbPage

import { KioskProvider } from "./context/KioskContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      <KioskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kiosks" element={<Kiosks />} />
            <Route path="/kiosks/:id" element={<KioskDetailPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPage />} />
            
            {/* --- I REMOVED THE BAD ROUTE --- */}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </KioskProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;