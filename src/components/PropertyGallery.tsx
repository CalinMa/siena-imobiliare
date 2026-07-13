"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";

export default function PropertyGallery({ 
  images, 
  title, 
  status, 
  transactionType 
}: { 
  images: string[], 
  title: string, 
  status: string,
  transactionType: string 
}) {
  const [index, setIndex] = useState(-1);

  if (!images || images.length === 0) {
    return null;
  }

  const mainImage = images[0];
  const galleryImages = images.map(src => ({ src }));
  const isSold = typeof status === 'string' && (status.toLowerCase().includes('vandut') || status.toLowerCase().includes('vândut'));
  const isRented = typeof status === 'string' && (status.toLowerCase().includes('inchiriat') || status.toLowerCase().includes('închiriat'));
  const showOverlay = isSold || isRented;
  const overlayText = isRented || (isSold && transactionType === 'inchiriere') ? 'ÎNCHIRIAT' : 'VÂNDUT';

  return (
    <>
      {/* Imagine Principală */}
      <div 
        className="w-full h-[40vh] md:h-[60vh] bg-gray-200 rounded-2xl overflow-hidden mb-6 shadow-md relative cursor-pointer group"
        onClick={() => setIndex(0)}
      >
        {showOverlay && (
           <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center pointer-events-none">
               <span className="text-white font-black text-4xl tracking-widest uppercase border-4 border-white px-8 py-3 rotate-[-15deg]">
                 {overlayText}
               </span>
           </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-0 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white px-4 py-2 rounded-lg font-medium transition-opacity backdrop-blur-sm">
                Apasă pentru galerie
            </span>
        </div>
        <Image 
          src={mainImage}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.02] ${showOverlay ? 'grayscale' : ''}`} 
          alt={title} 
        />
      </div>

      {/* Galerie */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {images.slice(1).map((img: string, idx: number) => (
            <div 
              key={idx + 1} 
              className="h-24 md:h-32 bg-gray-200 rounded-xl overflow-hidden shadow-sm cursor-pointer group relative"
              onClick={() => setIndex(idx + 1)}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10"></div>
              <Image src={img} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110" alt={`${title} - ${idx + 2}`} />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={galleryImages}
        carousel={{ finite: false }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .9)" } }}
      />
    </>
  );
}
