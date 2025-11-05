// src/context/KioskContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client'; 
import { toast } from "sonner"; 

// --- (Interfaces are unchanged) ---
export interface Kiosk {
  id: number;
  name: string;
  address: string;
  distance: string;
  availableBatteries: number;
  totalBatteries: number;
  status: "operational" | "busy" | "maintenance";
  coordinates: { lat: number; lng: number };
  reservedBatteries: number;
}
export type LiveKiosk = Kiosk; 
export interface HistoryData {
  time: string;
  totalAvailable: number;
}
interface KioskContextType {
  liveKiosks: LiveKiosk[];
  history: HistoryData[];
  totalEarnings: number;
  reserveBattery: (kioskId: number, amount: number) => Promise<void>;
  directUnlock: (kioskId: number, amount: number) => Promise<void>;
  completeReservation: (kioskId: number, amount: number) => Promise<void>;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const KioskProvider = ({ children }: { children: ReactNode }) => {
  const [liveKiosks, setLiveKiosks] = useState<LiveKiosk[]>([]);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0); 

  const fetchTotalEarnings = async () => {
    const { data, error } = await (supabase.from('reservations') as any)
      .select('payment_amount')
      .in('status', ['active', 'completed']); 
      
    if (data) {
      const sum = data.reduce((acc: number, row: { payment_amount: number }) => acc + row.payment_amount, 0);
      setTotalEarnings(sum);
    }
  };

  useEffect(() => {
    // --- 1. FETCH INITIAL DATA ---
    const fetchInitialData = async () => {
      const { data, error } = await (supabase.from('kiosks') as any)
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.error("Error fetching initial kiosk data:", error);
      } else if (data) {
        const formattedData: LiveKiosk[] = (data as any[]).map(kiosk => ({
          ...kiosk,
          coordinates: typeof kiosk.coordinates === 'string' 
            ? JSON.parse(kiosk.coordinates) 
            : kiosk.coordinates,
          status: kiosk.status as "operational" | "busy" | "maintenance",
        }));
        setLiveKiosks(formattedData);
      }
      await fetchTotalEarnings();
    };

    fetchInitialData();

    // --- 2. REAL-TIME LISTENER ---
    const channel = supabase
      .channel('kiosk-updates') 
      .on(
        'broadcast', 
        { event: 'kiosk_updated' }, 
        (payload) => {
          console.log('Broadcast received!', payload);
          const updatedKiosk = payload.payload as any; 
          setLiveKiosks(currentKiosks => 
            currentKiosks.map(k => 
              k.id === updatedKiosk.id 
              ? { ...updatedKiosk,
                  coordinates: typeof updatedKiosk.coordinates === 'string' ? JSON.parse(updatedKiosk.coordinates) : updatedKiosk.coordinates,
                  status: updatedKiosk.status as "operational" | "busy" | "maintenance",
                } 
              : k 
            )
          );
          fetchTotalEarnings(); // Re-fetch earnings on any update
        }
      )
      .subscribe();

    // --- 3. NEW: "FRONTEND CRON JOB" ---
    // This timer will call our backend worker function every 60 seconds
    const runTaskQueue = async () => {
      console.log("Running task queue...");
      await supabase.functions.invoke('run-task-queue');
    };
    
    // Run it once on load, then every 60 seconds
    runTaskQueue(); 
    const taskInterval = setInterval(runTaskQueue, 60000); // 60,000 ms = 1 minute
    
    // --- 4. CLEAN UP ---
    return () => {
      supabase.removeChannel(channel);
      clearInterval(taskInterval); // Stop the timer
    };
  }, []); 

  // --- (Payment functions are unchanged) ---
  const reserveBattery = async (kioskId: number, amount: number) => {
    const { error } = await supabase.functions.invoke('process-payment', {
      body: { kioskId, mode: 'reserve', amount },
    });
    if (error) {
      console.error('Error reserving battery:', error);
      toast.error("Reservation Failed", { description: error.message });
      throw new Error(error.message); // Re-throw error so the page can catch it
    }
    sessionStorage.setItem("myReservationId", kioskId.toString());
  };
  
  const directUnlock = async (kioskId: number, amount: number) => {
    const { error } = await supabase.functions.invoke('process-payment', {
      body: { kioskId, mode: 'unlock', amount },
    });
    if (error) {
      console.error('Error unlocking battery:', error);
      toast.error("Unlock Failed", { description: error.message });
      throw new Error(error.message);
    }
  };

  const completeReservation = async (kioskId: number, amount: number) => {
    const { error } = await supabase.functions.invoke('process-payment', {
      body: { kioskId, mode: 'complete', amount },
    });
    if (error) {
      console.error('Error completing reservation:', error);
      toast.error("Unlock Failed", { description: error.message });
      throw new Error(error.message);
    }
    sessionStorage.removeItem("myReservationId");
  };

  return (
    <KioskContext.Provider value={{ 
      liveKiosks, 
      history, 
      totalEarnings,
      reserveBattery,
      directUnlock,
      completeReservation
    }}>
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosks = () => {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosks must be used within a KioskProvider');
  }
  return context;
};