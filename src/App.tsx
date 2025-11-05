// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // This is your old homepage
import Kiosks from "./pages/Kiosks";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/Admin";
import KioskDetailPage from "./pages/KioskDetail";
import { KioskProvider } from "./context/KioskContext";

// --- 1. IMPORT YOUR NEW COMPONENTS ---
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
// ------------------------------------

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      <KioskProvider>
        <BrowserRouter>
          <Routes>
            {/* --- 2. SET THE NEW LOGIN PAGE AS THE HOMEPAGE --- */}
            <Route path="/" element={<LoginPage />} />
            {/* ------------------------------------------------ */}
            
            {/* --- 3. MOVE YOUR OLD HOMEPAGE TO /home --- */}
            <Route path="/home" element={<Index />} />
            {/* ------------------------------------------- */}

            <Route path="/kiosks" element={<Kiosks />} />
            <Route path="/kiosks/:id" element={<KioskDetailPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* --- 4. WRAP YOUR ADMIN ROUTE IN THE PROTECTED ROUTE --- */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route index element={<AdminPage />} />
            </Route>
            {/* ---------------------------------------------------- */}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </KioskProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;