// src/pages/Dashboard.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Battery, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar"; // Corrected Navbar import path
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// --- 1. Define a type that MATCHES your table ---
interface Reservation {
  id: number;
  created_at: string;
  kiosk_id: number | null; // This matches your screenshot
  status: string | null;
  user_id: string;
  payment_amt: number | null;
}

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 2. Fetch data when the component loads ---
  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          // This RLS query is now active and secure
          const { data, error } = await supabase
            .from('reservations')
            .select('*') // Fetches all columns
            .order('created_at', { ascending: false }) // Show newest first
            .limit(5); // Only get the 5 most recent

          if (error) throw error;
          
          setReservations(data || []); // Handle null as empty array

        } catch (error: any) {
          toast.error("Failed to fetch recent swaps: " + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [user]); // Re-run this effect if the user changes


  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // --- 3. Calculate stats from REAL data ---
  const totalSwaps = reservations.length;
  const totalSpent = reservations.reduce((acc, swap) => acc + (swap.payment_amt || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.email || user?.email}!
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* --- 4. Stats Grid (now uses REAL data) --- */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Swaps
              </CardTitle>
              <Battery className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {loading ? '...' : totalSwaps}
              </div>
              <p className="text-xs text-muted-foreground">
                Your total completed swaps
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
              <Battery className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {loading ? '...' : `$${totalSpent.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">
                Your total spending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- 5. Recent Swaps (now uses REAL data) --- */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Battery Swaps</CardTitle>
            <CardDescription>Your swap history and activity</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading activities...</p>
            ) : reservations.length === 0 ? (
              // This message will now show correctly
              <p>You have no recent activity.</p>
            ) : (
              <div className="space-y-4">
                {reservations.map((swap) => (
                  <div
                    key={swap.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Battery className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        {/* 6. Display Kiosk ID instead of name */}
                        <p className="font-medium">Kiosk ID: {swap.kiosk_id || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(swap.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-secondary">
                        {swap.status || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;