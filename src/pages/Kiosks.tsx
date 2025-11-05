// src/pages/Kiosks.tsx

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Battery, Clock, Navigation, Sparkles, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet'; // <-- Tooltip added
import L from 'leaflet';
import 'leaflet-routing-machine';
import { toast } from "sonner";

// --- All imports now come from the context ---
import { useKiosks, LiveKiosk } from "@/context/KioskContext"; 
import { PaymentModal, PaymentMode } from "@/components/PaymentModal"; 

// --- (Icon fix and Routing component are unchanged) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

interface RoutingProps { origin: { lat: number, lng: number }; destination: { lat: number, lng: number }; }
const Routing = ({ origin, destination }: RoutingProps) => {
  const map = useMap();
  const routingControlRef = useRef<any | null>(null); 
  useEffect(() => {
    if (!map) return;
    if (routingControlRef.current) map.removeControl(routingControlRef.current);
    routingControlRef.current = (L.Routing.control as any)({
      waypoints: [ L.latLng(origin.lat, origin.lng), L.latLng(destination.lat, destination.lng) ],
      routeWhileDragging: false, addWaypoints: false, draggableWaypoints: false, show: false,
      lineOptions: { styles: [{ color: '#6d28d9', opacity: 0.8, weight: 6 }] } as L.Routing.LineOptions,
    }).addTo(map);
    return () => { if (routingControlRef.current) map.removeControl(routingControlRef.current); };
  }, [map, origin, destination]); 
  return null; 
};
// --- (End of unchanged section) ---


const Kiosks = () => {
  // --- GET LIVE DATA & FUNCTIONS FROM CONTEXT ---
  const { liveKiosks, reserveBattery, directUnlock, completeReservation } = useKiosks(); 

  const [selectedKiosk, setSelectedKiosk] = useState<LiveKiosk | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const defaultCenter = { lat: 40.7128, lng: -74.006 }; // Default center

  // --- STATE FOR THE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<PaymentMode | null>(null);
  const [kioskForPayment, setKioskForPayment] = useState<LiveKiosk | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => { setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }); },
      () => { console.error("Geolocation failed."); setUserLocation(defaultCenter); }
    );
  }, []); 

  // --- FUNCTIONS TO OPEN THE MODAL ---
  const openPaymentModal = (kiosk: LiveKiosk, mode: PaymentMode) => {
    setKioskForPayment(kiosk);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  // --- UPDATED ASYNC PAYMENT FUNCTION ---
  const handlePaymentConfirm = async (amount: number) => {
    if (!kioskForPayment || !modalMode) return;

    // Show a "loading" toast while the backend works
    const toastId = toast.loading("Processing your payment...");

    try {
      if (modalMode === 'reserve') {
        await reserveBattery(kioskForPayment.id, amount); // Wait for the function to complete
        toast.success("Reservation Confirmed!", {
          id: toastId, // Update the loading toast
          description: `Your battery at ${kioskForPayment.name} is reserved.`,
        });
      } else if (modalMode === 'unlock') {
        await directUnlock(kioskForPayment.id, amount);
        toast.success("Payment Successful! Kiosk Unlocked.", {
          id: toastId,
          description: `You have unlocked a battery at ${kioskForPayment.name}.`,
        });
      } else if (modalMode === 'complete') {
        await completeReservation(kioskForPayment.id, amount);
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
  
  const handleFindBestKiosk = () => {
    const operationalKiosks = liveKiosks.filter(k => k.status === 'operational');
    if (operationalKiosks.length === 0) {
      toast.error("No operational kiosks found.");
      return;
    }
    operationalKiosks.sort((a, b) => b.availableBatteries - a.availableBatteries);
    const bestKiosk = operationalKiosks[0];
    setSelectedKiosk(bestKiosk);
    toast.info("We found the best kiosk for you!", {
      description: `${bestKiosk.name} has the most available batteries.`,
    });
  };

  if (!userLocation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <MapPin className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-lg text-muted-foreground mt-4">Finding your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Find Nearby Kiosks
          </h1>
          <p className="text-muted-foreground">
            Locate battery swapping stations near you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          <Card className="md:sticky md:top-24 h-[400px] md:h-[500px]">
            <CardContent className="p-0 h-full">
              <MapContainer 
                center={userLocation} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                <Marker position={userLocation}><Popup>You are here</Popup></Marker>
                
                {liveKiosks.map((kiosk) => (
                  <Marker 
                    key={kiosk.id} 
                    position={kiosk.coordinates}
                    eventHandlers={{ click: () => setSelectedKiosk(kiosk), }}
                  >
                    {/* --- THIS IS THE FIX --- */}
                    <Tooltip>
                      <b>{kiosk.name}</b><br />
                      Available: {kiosk.availableBatteries}<br />
                      Reserved: {kiosk.reservedBatteries}
                    </Tooltip>
                    {/* --------------------- */}
                  </Marker>
                ))}
                
                {userLocation && selectedKiosk && (
                  <Routing origin={userLocation} destination={selectedKiosk.coordinates} />
                )}
              </MapContainer>
            </CardContent>
          </Card>


          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <Button className="w-full text-lg" onClick={handleFindBestKiosk}>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Find Best Kiosk For Me
                </Button>
              </CardContent>
            </Card>

            {liveKiosks.map((kiosk) => {
              const isOperational = kiosk.status === 'operational';
              const canReserve = isOperational && kiosk.availableBatteries > 0;
              const canUnlock = isOperational && kiosk.availableBatteries > 0;
              
              const myReservationId = sessionStorage.getItem("myReservationId");
              const thisIsMyReservedKiosk = myReservationId ? (parseInt(myReservationId) === kiosk.id) : false;

              return (
              <Card
                key={kiosk.id}
                className={`transition-all cursor-pointer hover:shadow-lg ${
                  selectedKiosk?.id === kiosk.id
                    ? "ring-2 ring-primary shadow-lg"
                    : ""
                }`}
                onClick={() => setSelectedKiosk(kiosk)} 
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        <Link
                          to={`/kiosks/${kiosk.id}`}
                          className="hover:underline"
                          onClick={(e) => e.stopPropagation()} 
                        >
                          {kiosk.name}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Navigation className="h-4 w-4" />
                        <span>{kiosk.distance} away</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(kiosk)}>
                      {getStatusText(kiosk)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{kiosk.address}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Battery className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Available</span>
                        <span className="text-lg font-bold">{kiosk.availableBatteries}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">Reserved</span>
                        <span className="text-lg font-bold">{kiosk.reservedBatteries}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-lg font-bold">{kiosk.totalBatteries}</span>
                      </div>
                    </div>

                    {thisIsMyReservedKiosk ? (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPaymentModal(kiosk, "complete");
                        }}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Unlock My Reserved Battery ($10)
                      </Button>
                    ) : (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          className="flex-1" 
                          disabled={!canReserve}
                          onClick={(e) => {
                            e.stopPropagation();
                            openPaymentModal(kiosk, "reserve");
                          }}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Reserve for Later ($5)
                        </Button>
                        <Button 
                          className="flex-1" 
                          variant="outline"
                          disabled={!canUnlock}
                          onClick={(e) => {
                            e.stopPropagation();
                            openPaymentModal(kiosk, "unlock");
                          }}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Unlock Now ($15)
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </main>

      <PaymentModal
        kiosk={kioskForPayment}
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
};

export default Kiosks;