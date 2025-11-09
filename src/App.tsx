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
import { KioskProvider } from "./context/KioskContext";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// --- 1. IMPORT YOUR NEW AUTHPROVIDER ---
import { AuthProvider } from "./context/AuthContext";
// ------------------------------------

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* --- 2. WRAP EVERYTHING IN AUTHPROVIDER --- */}
      {/* AuthProvider should go *inside* QueryClientProvider
          but *outside* KioskProvider and BrowserRouter */}
      <AuthProvider>
        <KioskProvider>
          <BrowserRouter>
            <Routes>
              {/* All your routes go here... */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<Index />} />
              <Route path="/kiosks" element={<Kiosks />} />
              <Route path="/kiosks/:id" element={<KioskDetailPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<AdminPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </KioskProvider>
      </AuthProvider>
      {/* ------------------------------------------- */}

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;