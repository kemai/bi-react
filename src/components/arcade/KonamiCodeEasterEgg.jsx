// src/components/KonamiCodeEasterEgg.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import GameLoader from "./snake/GameLoader";

export default function KonamiCodeEasterEgg() {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);

  const konamiCode = [
    "ArrowUp","ArrowUp",
    "ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight",
    "ArrowLeft","ArrowRight",
    "b","a"
  ];


  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        if (konamiIndex === konamiCode.length - 1) {
          setShowEasterEgg(true);
          setKonamiIndex(0);
        } else {
          setKonamiIndex((i) => i + 1);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [konamiIndex]);

  return (
    <Dialog open={showEasterEgg} onOpenChange={setShowEasterEgg}>
      {/* sfondo scuro */}
      <DialogOverlay />

      {/* contenuto del dialog */}
      <DialogContent className="bg-gray-900 text-white p-6 rounded-lg w-[90vw] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            🎮 You found a secret game!
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="mt-1 text-sm text-gray-300">
          Enjoy! Premilo ✕ in alto a destra per uscire.
        </DialogDescription>

        <div className="mt-6">
          <GameLoader />
        </div>

        {/* pulsante di chiusura posizionato da Radix, ma possiamo spostarlo qui */}
        <DialogClose className="absolute top-4 right-4 text-white hover:opacity-80">
          ✕
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
