// src/pages/KioskDetail.tsx

import { useParams, Link } from "react-router-dom";
import { useKiosks, LiveKiosk } from "@/context/KioskContext"; // Import from Context
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Battery, Clock, Navigation, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react"; 
import { PaymentModal, PaymentMode } from "@/components/PaymentModal"; 

// --- HELPER FUNCTIONS ---
const getStatusColor = (kiosk: LiveKiosk) => {
  if (kiosk.reservedBatteries > 0) return "bg-blue-500 text-white";
  switch (kiosk.status) {
    case "operational": return "bg-green-500 text-white";
    case "busy": return "bg-yellow-500 text-white";
    case "maintenance": return "bg-red-500 text-white";
    default: return "bg-muted";
  }
};

const getStatusText = (kiosk: LiveKiosk) => {
  if (kiosk.reservedBatteries > 0) return "Reserved";
  return kiosk.status;
}
// -------------------------

const KioskDetailPage = () => {
  const { id } = useParams(); 
  
  // --- GET LIVE DATA & FUNCTIONS FROM CONTEXT ---
  const { liveKiosks, reserveBattery, directUnlock, completeReservation } = useKiosks(); 

  // Find the kiosk from the LIVE data
  const kiosk = liveKiosks.find((k) => k.id === parseInt(id || ""));

  // --- MODAL STATE & FUNCTIONS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<PaymentMode | null>(null);

  const openPaymentModal = (mode: PaymentMode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  // --- UPDATED ASYNC PAYMENT FUNCTION ---
  const handlePaymentConfirm = async (amount: number) => {
    if (!kiosk || !modalMode) return;

    const toastId = toast.loading("Processing your payment...");

    try {
      if (modalMode === 'reserve') {
        await reserveBattery(kiosk.id, amount);
        toast.success("Reservation Confirmed!", {
          id: toastId,
          description: `Your battery at ${kiosk.name} is reserved.`,
        });
      } else if (modalMode === 'unlock') {
        await directUnlock(kiosk.id, amount);
        toast.success("Payment Successful! Kiosk Unlocked.", {
          id: toastId,
          description: `You have unlocked a battery at ${kiosk.name}.`,
        });
      } else if (modalMode === 'complete') {
        await completeReservation(kiosk.id, amount);
        toast.success("Reservation Unlocked!", {
          id: toastId,
          description: `Your payment of $10 is complete.`,
        });
      }
    } catch (error) {
      toast.error("Payment Failed", {
        id: toastId,
        description: "An error occurred. Please try again.",
      });
    }
  };

  if (!kiosk) {
    // This now reads from the live data, so it's a real "Not Found"
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Kiosk Not Found</h1>
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

  // --- Check for this user's reservation ---
  const myReservationId = sessionStorage.getItem("myReservationId");
  const thisIsMyReservedKiosk = myReservationId ? (parseInt(myReservationId) === kiosk.id) : false;
  const isOperational = kiosk.status === 'operational';
  const canReserve = isOperational && kiosk.availableBatteries > 0;
  const canUnlock = isOperational && kiosk.availableBatteries > 0;

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
                <Badge className={getStatusColor(kiosk)}>{getStatusText(kiosk)}</Badge>
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
                    <span className="text-muted-foreground">Available</span>
                    <span className="text-2xl font-bold text-green-500">{kiosk.availableBatteries}</span>
                  </div>
                   <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reserved</span>
                    <span className="text-2xl font-bold text-blue-500">{kiosk.reservedBatteries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Capacity</span>
                    <span className="text-2xl font-bold">{kiosk.totalBatteries}</span>
                  </div>
                </CardContent>
              </Card>

              {/* --- DYNAMIC BUTTONS --- */}
              {thisIsMyReservedKiosk ? (
                <Button 
                  className="w-full text-lg" 
                  size="lg"
                  onClick={() => openPaymentModal("complete")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Unlock My Reserved Battery ($10)
                </Button>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1" 
                    disabled={!canReserve}
                    onClick={() => openPaymentModal("reserve")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Reserve for Later ($5)
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    disabled={!canUnlock}
                    onClick={() => openPaymentModal("unlock")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock Now ($15)
                  </Button>
                </div>
              )}
              {/* ----------------------------- */}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <PaymentModal
        kiosk={kiosk} // We just pass the kiosk from the page
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
};

export default KioskDetailPage;