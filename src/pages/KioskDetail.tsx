// src/pages/KioskDetail.tsx

import { useParams, Link } from "react-router-dom";
// --- 1. IMPORT THE LIVE DATA HOOK AND KIOSK TYPE ---
import { useKiosks } from "@/context/KioskContext";
import type { Kiosk } from "./Kiosks"; // We still need the type
// ---------------------------------------------------
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Battery, Clock, Navigation, ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";

// (These helper functions are fine)
const getStatusColor = (status: Kiosk["status"]) => {
  switch (status) {
    case "operational":
      return "bg-secondary text-secondary-foreground";
    case "busy":
      return "bg-yellow-500 text-white";
    case "maintenance":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted";
  }
};

const getAvailabilityColor = (available: number, total: number) => {
  const percentage = (available / total) * 100;
  if (percentage > 50) return "text-secondary";
  if (percentage > 20) return "text-yellow-500";
  return "text-destructive";
};

const KioskDetailPage = () => {
  const { id } = useParams(); // Reads the 'id' from the URL (e.g., "/kiosks/1")
  
  // --- 2. GET LIVE DATA FROM THE CONTEXT ---
  const { liveKiosks } = useKiosks();
  // -----------------------------------------

  // --- 3. THIS IS THE CORRECTED LINE ---
  // We use parseInt(id || "") to convert the string 'id' from the URL into a number
  const kiosk = liveKiosks.find((k) => k.id === parseInt(id || ""));
  // -------------------------------------

  // The 'Book Swap' function
  const handleBookSwap = (kioskName: string) => {
    toast.success("Reservation Confirmed!", {
      description: `Your battery swap at ${kioskName} is confirmed for the next 15 minutes.`,
      duration: 5000,
    });
  };

  if (!kiosk) {
    // This now works perfectly. If the simulation runs and the ID is somehow
    // not in the list, this will show.
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Kiosk Not Found</h1>
          <p className="text-muted-foreground mb-4">
            We couldn't find a kiosk with that ID.
          </p>
          <Button asChild>
            <Link to="/kiosks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kiosk List
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  // If we found the kiosk, show its (live) details
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        
        <div className="mb-4">
          <Button variant="outline" asChild>
            <Link to="/kiosks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kiosk List
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          <Card>
            <CardContent className="p-0">
              <img
                src={kiosk.id % 2 === 0 ? "/src/assets/hero-ev-swap.jpg" : "/src/assets/kiosk-exterior.jpg"}
                alt={kiosk.name}
                className="rounded-lg object-cover w-full h-[400px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl font-bold">{kiosk.name}</CardTitle>
                <Badge className={getStatusColor(kiosk.status)}>{kiosk.status}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <MapPin className="h-4 w-4" />
                <span>{kiosk.address}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="bg-muted">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Available Batteries</span>
                    <span
                      className={`text-2xl font-bold ${getAvailabilityColor(
                        kiosk.availableBatteries,
                        kiosk.totalBatteries
                      )}`}
                    >
                      {/* THIS NUMBER IS NOW LIVE! */}
                      {kiosk.availableBatteries} / {kiosk.totalBatteries}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="text-lg font-medium">{kiosk.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Battery Types</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">Type A (Scooter)</Badge>
                      <Badge variant="outline">Type B (Car)</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full text-lg"
                size="lg"
                disabled={kiosk.status !== "operational"}
                onClick={() => handleBookSwap(kiosk.name)}
              >
                <Clock className="h-5 w-5 mr-2" />
                Book Swap Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default KioskDetailPage;