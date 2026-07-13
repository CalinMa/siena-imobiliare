"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
  showText?: boolean;
}

export default function ShareButton({ title, text, url, className = "", showText = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text || title,
          url: fullUrl,
        });
      } catch (err) {
        console.log("Eroare la share:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Nu am putut copia link-ul", err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 transition-colors ${className}`}
      aria-label="Distribuie"
      title="Distribuie acest anunț"
    >
      {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
      {showText && <span>{copied ? "Link Copiat!" : "Distribuie"}</span>}
    </button>
  );
}
