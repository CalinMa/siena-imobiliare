"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Așteptăm puțin pentru a nu bloca vizualizarea inițială
    const timer = setTimeout(() => {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) {
        setShow(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShow(false);
  };

  const handleClose = () => {
    // Putem alege să nu salvăm decizia în cache dacă doar închide, sau să o asimilăm cu un refuz temporar.
    // O vom trata ca închidere temporară, urmând să apară din nou la următoarea sesiune (sau îi dăm setItem "dismissed")
    sessionStorage.setItem("cookie_consent_dismissed", "true");
    setShow(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("cookie_consent_dismissed")) {
      setShow(false);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.15)] z-[100] animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
        
        <button 
          onClick={handleClose}
          className="absolute -top-2 -right-2 md:hidden text-gray-400 hover:text-gray-700 p-2 bg-gray-50 rounded-full"
          aria-label="Închide"
        >
          <X size={16} />
        </button>

        <div className="flex-1 pr-8 md:pr-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Folosim module cookie pentru a vă oferi o experiență de navigare mai bună și pentru a analiza traficul. 
            Prin apăsarea butonului "Accept", sunteți de acord cu utilizarea tuturor cookie-urilor. 
            Puteți afla mai multe detalii consultând pagina noastră de <Link href="/termeni" className="text-green-700 hover:text-green-800 hover:underline font-bold">Termeni și Politici</Link>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
          <button 
            onClick={handleReject}
            className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-center"
          >
            Refuză
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors shadow-sm text-center"
          >
            Acceptă
          </button>
          <button 
            onClick={handleClose}
            className="hidden md:flex items-center justify-center p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors ml-1"
            aria-label="Închide"
            title="Închide temporar"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
