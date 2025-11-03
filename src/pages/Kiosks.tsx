import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Battery, Clock, Navigation, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

import { toast } from "sonner";

// --- 1. IMPORT useKiosks FROM YOUR NEW CONTEXT ---
import { useKiosks } from "@/context/KioskContext"; 
// Note: Your path might be '../context/KioskContext' if you're in src/pages
// --------------------------------------------------

export interface Kiosk {
  id: number;
  name: string;
  address: string;
  distance: string;
  availableBatteries: number;
  totalBatteries: number;
  status: "operational" | "busy" | "maintenance";
  coordinates: { lat: number; lng: number };
}

// We KEEP this mock data here because our Context file reads from it
export const mockKiosks: Kiosk[] = [
  {
    id: 1,
    name: "Downtown Station",
    address: "123 Main St, Downtown",
    distance: "0.5 km",
    availableBatteries: 8,
    totalBatteries: 12,
    status: "operational",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "Tech Park Hub",
    address: "456 Innovation Ave, Tech District",
    distance: "1.2 km",
    availableBatteries: 3,
    totalBatteries: 10,
    status: "busy",
    coordinates: { lat: 40.7282, lng: -73.9942 },
  },
  {
    id: 3,
    name: "Green Valley Center",
    address: "789 Eco Blvd, Green Valley",
    distance: "2.8 km",
    availableBatteries: 10,
    totalBatteries: 15,
    status: "operational",
    coordinates: { lat: 40.7489, lng: -73.9681 },
  },
  {
    id: 4,
    name: "Uptown Plaza",
    address: "101 Maple Drive, Uptown",
    distance: "3.1 km",
    availableBatteries: 5,
    totalBatteries: 10,
    status: "operational",
    coordinates: { lat: 40.755, lng: -73.986 },
  },
  {
    id: 5,
    name: "Riverfront Kiosk",
    address: "22 River Rd, Waterside",
    distance: "3.5 km",
    availableBatteries: 0,
    totalBatteries: 10,
    status: "maintenance",
    coordinates: { lat: 40.705, lng: -74.011 },
  },
  {
    id: 6,
    name: "Central Station",
    address: "500 Grand St, Midtown",
    distance: "4.0 km",
    availableBatteries: 12,
    totalBatteries: 15,
    status: "operational",
    coordinates: { lat: 40.735, lng: -73.99 },
  },
  {
    id: 7,
    name: "Westside Mall",
    address: "332 West End Ave, Westside",
    distance: "4.2 km",
    availableBatteries: 2,
    totalBatteries: 10,
    status: "busy",
    coordinates: { lat: 40.778, lng: -73.982 },
  },
  {
    id: 8,
    name: "Airport Loop",
    address: "700 Airport Blvd, Airport",
    distance: "10.5 km",
    availableBatteries: 14,
    totalBatteries: 20,
    status: "operational",
    coordinates: { lat: 40.6413, lng: -73.7781 },
  },
  {
    id: 9,
    name: "University Hub",
    address: "90 College Cres, University Hill",
    distance: "5.1 km",
    availableBatteries: 4,
    totalBatteries: 10,
    status: "operational",
    coordinates: { lat: 40.761, lng: -73.971 },
  },
  {
    id: 10,
    name: "Southpoint Depot",
    address: "45 South St, Southpoint",
    distance: "5.8 km",
    availableBatteries: 7,
    totalBatteries: 10,
    status: "operational",
    coordinates: { lat: 40.69, lng: -73.985 },
  },
];
// --- (The rest of your Kiosks.tsx file stays exactly the same) ---

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


interface RoutingProps {
  origin: { lat: number, lng: number };
  destination: { lat: number, lng: number };
}

const Routing = ({ origin, destination }: RoutingProps) => {
  const map = useMap();
  const routingControlRef = useRef<any | null>(null); 

  useEffect(() => {
    if (!map) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = (L.Routing.control as any)({
      waypoints: [
        L.latLng(origin.lat, origin.lng),
        L.latLng(destination.lat, destination.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      lineOptions: {
        styles: [{ color: '#6d28d9', opacity: 0.8, weight: 6 }]
      } as L.Routing.LineOptions,
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, origin, destination]); 

  return null; 
};

const Kiosks = () => {
  // --- 2. GET LIVE DATA FROM THE CONTEXT ---
  const { liveKiosks } = useKiosks();
  // -----------------------------------------

  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null);
  
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  // We'll use the first kiosk from the live data as the default
  const defaultCenter = liveKiosks[0].coordinates; 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.error("Error: Geolocation failed. Using default location.");
        setUserLocation(defaultCenter); 
      }
    );
  }, [defaultCenter]); // Added dependency

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
  
  const handleBookSwap = (kioskName: string) => {
    console.log(`Booking swap at ${kioskName}`);
    toast.success("Reservation Confirmed!", {
      description: `Your battery swap at ${kioskName} is confirmed for the next 15 minutes.`,
      duration: 5000, 
    });
  };

  const handleFindBestKiosk = () => {
    // --- 3. USE liveKiosks FOR THE AI ---
    const operationalKiosks = liveKiosks.filter(k => k.status === 'operational');
    // ------------------------------------
    
    if (operationalKiosks.length === 0) {
      toast.error("No operational kiosks found", {
        description: "Please check back later.",
      });
      return;
    }

    operationalKiosks.sort((a, b) => b.availableBatteries - a.availableBatteries);

    const bestKiosk = operationalKiosks[0];
    setSelectedKiosk(bestKiosk);

    toast.info("We found the best kiosk for you!", {
      description: `${bestKiosk.name} has the most available batteries right now.`,
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
                center={userLocation} 
                zoom={13} 
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <Marker position={userLocation}>
                  <Popup>You are here</Popup>
                </Marker>

                {/* --- 4. USE liveKiosks FOR THE MAP MARKERS --- */}
                {liveKiosks.map((kiosk) => (
                // --------------------------------------------
                  <Marker 
                    key={kiosk.id} 
                    position={kiosk.coordinates}
                    eventHandlers={{
                      click: () => setSelectedKiosk(kiosk),
                    }}
                  >
                    <Popup>
                      <b>{kiosk.name}</b><br />
                      {kiosk.availableBatteries} batteries available.
                    </Popup>
                  </Marker>
                ))}
                
                {userLocation && selectedKiosk && (
                  <Routing 
                    origin={userLocation} 
                    destination={selectedKiosk.coordinates} 
                  />
                )}

              </MapContainer>
            </CardContent>
          </Card>


          <div className="space-y-4">

            <Card>
              <CardContent className="p-4">
                <Button 
                  className="w-full text-lg" 
                  onClick={handleFindBestKiosk}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Find Best Kiosk For Me
                </Button>
              </CardContent>
            </Card>


            {/* --- 5. USE liveKiosks FOR THE LIST --- */}
            {liveKiosks.map((kiosk) => (
            // ----------------------------------------
              <Card
                key={kiosk.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
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
                    <Badge className={getStatusColor(kiosk.status)}>
                      {kiosk.status}
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
                        <Battery className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Available Batteries</span>
                      </div>
                      <span
                        className={`text-lg font-bold ${getAvailabilityColor(
                          kiosk.availableBatteries,
                          kiosk.totalBatteries
                        )}`}
                      >
                        {kiosk.availableBatteries}/{kiosk.totalBatteries}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1" 
                        disabled={kiosk.status !== "operational"}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleBookSwap(kiosk.name);
                        }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Book Swap
                      </Button>
                      <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kiosks;