// src/context/KioskContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockKiosks, Kiosk } from '@/pages/Kiosks';

export interface HistoryData {
  time: string;
  totalAvailable: number;
}

interface KioskContextType {
  liveKiosks: Kiosk[];
  history: HistoryData[];
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

const MAX_HISTORY_LENGTH = 30; 

export const KioskProvider = ({ children }: { children: ReactNode }) => {
  const [liveKiosks, setLiveKiosks] = useState<Kiosk[]>(mockKiosks);
  const [history, setHistory] = useState<HistoryData[]>([]);

  useEffect(() => {
    const simulationInterval = setInterval(() => {
      
      // We must use the 'updater' function to get the latest state
      setLiveKiosks(currentKiosks => {
        // Create a new copy of the array
        const updatedKiosks = [...currentKiosks];

        // --- 1. Simulate a "Swap" ---
        const swappableKiosks = updatedKiosks.filter(
          k => k.status === 'operational' && k.availableBatteries > 0
        );
        
        if (swappableKiosks.length > 0) {
          const kioskToSwap = swappableKiosks[Math.floor(Math.random() * swappableKiosks.length)];
          const index = updatedKiosks.findIndex(k => k.id === kioskToSwap.id);
          
          if (index !== -1) {
            // --- THIS IS THE FIX ---
            // Create a new object instead of mutating the old one
            updatedKiosks[index] = {
              ...updatedKiosks[index], // copy all old properties
              availableBatteries: updatedKiosks[index].availableBatteries - 1, // overwrite one
            };
          }
        }

        // --- 2. Simulate a "Recharge" ---
        const rechargeableKiosks = updatedKiosks.filter(
          k => k.availableBatteries < k.totalBatteries
        );

        if (rechargeableKiosks.length > 0) {
          const kioskToRecharge = rechargeableKiosks[Math.floor(Math.random() * rechargeableKiosks.length)];
          const index = updatedKiosks.findIndex(k => k.id === kioskToRecharge.id);

          if (index !== -1) {
            // --- THIS IS THE FIX ---
            // Create a new object
            updatedKiosks[index] = {
              ...updatedKiosks[index], // copy all old properties
              availableBatteries: updatedKiosks[index].availableBatteries + 1, // overwrite one
            };
          }
        }
        
        // --- 3. Update History (Moved inside setLiveKiosks) ---
        // This logic now runs *after* the kiosks have been updated
        const totalAvailableOnThisTick = updatedKiosks.reduce(
            (sum, k) => sum + k.availableBatteries, 0
        );

        setHistory(currentHistory => {
            const now = new Date();
            const newHistoryEntry: HistoryData = {
              time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
              totalAvailable: totalAvailableOnThisTick,
            };
            const updatedHistory = [...currentHistory, newHistoryEntry];
            if (updatedHistory.length > MAX_HISTORY_LENGTH) {
              updatedHistory.shift();
            }
            return updatedHistory;
        });
        
        // --- 4. Return the new state for liveKiosks ---
        return updatedKiosks;
      });

    }, 3000); // Run simulation every 3 seconds

    return () => clearInterval(simulationInterval);
  }, []); // Empty array is correct

  return (
    <KioskContext.Provider value={{ liveKiosks, history }}>
      {children}
    </KioskContext.Provider>
  );
};

// --- This is a custom hook ---
// It's a simple way for our pages to get the live data
export const useKiosks = () => {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosks must be used within a KioskProvider');
  }
  return context;
};