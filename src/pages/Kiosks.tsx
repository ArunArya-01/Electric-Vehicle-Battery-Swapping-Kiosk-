import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Battery, Clock, Navigation } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Kiosk {
  id: number;
  name: string;
  address: string;
  distance: string;
  availableBatteries: number;
  totalBatteries: number;
  status: "operational" | "busy" | "maintenance";
  coordinates: { lat: number; lng: number };
}

const mockKiosks: Kiosk[] = [
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
];

const Kiosks = () => {
  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null);

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
          {/* Map Placeholder */}
          <Card className="md:sticky md:top-24 h-fit">
            <CardContent className="p-0">
              <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="relative text-center z-10">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive map coming soon
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedKiosk
                      ? `Selected: ${selectedKiosk.name}`
                      : "Select a kiosk to view location"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kiosk List */}
          <div className="space-y-4">
            {mockKiosks.map((kiosk) => (
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
                      <CardTitle className="text-xl mb-2">{kiosk.name}</CardTitle>
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
                      <Button className="flex-1" disabled={kiosk.status !== "operational"}>
                        <Clock className="h-4 w-4 mr-2" />
                        Book Swap
                      </Button>
                      <Button variant="outline">
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
