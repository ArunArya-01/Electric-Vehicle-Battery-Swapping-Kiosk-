// src/components/PaymentModal.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- THIS IS THE ONLY IMPORT YOU NEED ---
import type { LiveKiosk } from "@/context/KioskContext"; 
// ----------------------------------------

export type PaymentMode = "reserve" | "unlock" | "complete";

const PAYMENT_DETAILS = {
  reserve: {
    title: "Reserve Battery",
    amount: 5,
    description: "This $5 fee will reserve your battery for 30 seconds (demo time).",
  },
  unlock: {
    title: "Direct Unlock",
    amount: 15,
    description: "This $15 fee is for an immediate walk-up swap.",
  },
  complete: {
    title: "Unlock Reserved Battery",
    amount: 10,
    description: "This $10 fee completes your reservation and unlocks the battery.",
  }
};

interface PaymentModalProps {
  kiosk: LiveKiosk | null;
  mode: PaymentMode | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void; 
}

export const PaymentModal = ({ kiosk, mode, isOpen, onClose, onConfirm }: PaymentModalProps) => {
  const [txnId, setTxnId] = useState("");

  if (!kiosk || !mode) return null;

  const details = PAYMENT_DETAILS[mode];
  const isButtonDisabled = txnId.length < 6;

  const handleConfirm = () => {
    onConfirm(details.amount); // Pass the correct amount
    setTxnId(""); 
    onClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{details.title}</DialogTitle>
          <DialogDescription>
            {details.description}
            <br />
            Kiosk: <strong>{kiosk.name}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=pay-swapcharge-${kiosk.id}-${details.amount}`}
            alt="QR Code for Payment"
            className="rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="txnId">Enter 6-Digit Payment ID (from GPay, etc.)</Label>
          <Input
            id="txnId"
            type="text"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="e.g., 123456"
            maxLength={6}
          />
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm}
            disabled={isButtonDisabled}
          >
            Verify & {details.title} (${details.amount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};