"use client";

import { useState, useCallback, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) {
    return null;
  }

  const galleryImages = images.map(src => ({ src }));
  const isSold = typeof status === 'string' && (status.toLowerCase().includes('vandut') || status.toLowerCase().includes('vândut'));
  const isRented = typeof status === 'string' && (status.toLowerCase().includes('inchiriat') || status.toLowerCase().includes('închiriat'));
  const showOverlay = isSold || isRented;
  const overlayText = isRented || (isSold && transactionType === 'inchiriere') ? 'ÎNCHIRIAT' : 'VÂNDUT';

  return (
    <>
      {/* Imagine Principală Carousel */}
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-gray-200 rounded-2xl overflow-hidden mb-6 shadow-md group">
        
        {/* Overlay Vândut/Închiriat */}
        {showOverlay && (
           <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center pointer-events-none">
               <span className="text-white font-black text-4xl tracking-widest uppercase border-4 border-white px-8 py-3 rotate-[-15deg]">
                 {overlayText}
               </span>
           </div>
        )}

        {/* Embla Carousel Viewport */}
        <div className="absolute inset-0 z-0 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="relative flex-[0_0_100%] h-full cursor-pointer active:scale-[0.99] transition-transform duration-200"
                onClick={() => setIndex(idx)}
              >
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white px-4 py-2 rounded-lg font-medium transition-opacity backdrop-blur-sm">
                        Apasă pentru galerie
                    </span>
                </div>
                <Image 
                  src={img}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className={`object-cover ${showOverlay ? 'grayscale' : ''}`} 
                  alt={`${title} - Imaginea ${idx + 1}`} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Butoane Navigare Desktop */}
        {images.length > 1 && (
          <>
            <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg z-30 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none">
              <ChevronLeft size={24} />
            </button>
            <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg z-30 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-none">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === selectedIndex ? 'bg-white w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Galerie */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {images.slice(1).map((img: string, idx: number) => (
            <div 
              key={idx + 1} 
              className="h-24 md:h-32 bg-gray-200 rounded-xl overflow-hidden shadow-sm cursor-pointer group relative active:scale-[0.95] transition-transform duration-200"
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
