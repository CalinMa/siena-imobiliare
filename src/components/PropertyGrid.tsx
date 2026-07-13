"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const PROPERTY_TYPES = [
  { id: 'apartament', label: 'Apartamente' },
  { id: 'casa', label: 'Case / Vile' },
  { id: 'teren', label: 'Terenuri' },
  { id: 'comercial', label: 'Spații Comerciale' },
  { id: 'birouri', label: 'Birouri' },
  { id: 'industrial', label: 'Spații Industriale' }
];

const PropertyCardItem = ({ p, hidePrices, basePath }: { p: any, hidePrices?: boolean, basePath: string }) => {
  const imagesRaw = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
  let displayImages = imagesRaw.slice(0, 5);
  if (displayImages.length === 0) {
    displayImages = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'];
  }
  const url = `${basePath}/${p.slug}`;
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative active:scale-[0.98]"
      onMouseEnter={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <div className="absolute inset-0 z-0 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {displayImages.map((img: string, idx: number) => (
              <Link href={url} key={idx} className="relative flex-[0_0_100%] h-full min-w-0">
                {(idx === 0 || hasInteracted) ? (
                  <Image src={img} alt={`${p.title} - ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {displayImages.length > 1 && (
          <>
            <button onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md z-30 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none">
              <ChevronLeft size={20} />
            </button>
            <button onClick={scrollNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md z-30 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <Link href={url} className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between">
          <div>
            {!hidePrices && (
              <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm pointer-events-auto">
                <div className="text-lg font-extrabold text-orange-600">
                  {Number(p.price).toLocaleString()} {p.currency === 'RON' ? 'RON' : p.currency === 'USD' ? '$' : '€'}{p.transaction_type === 'inchiriere' ? ' / lună' : ''}
                </div>
              </div>
            )}
            {(p.status === 'activ' || p.status === 'Activă') && (
              <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm pointer-events-auto">
                <div className="text-sm font-extrabold text-green-700 uppercase tracking-wider">
                  {p.transaction_type === 'inchiriere' ? 'De închiriat' : 'De vânzare'}
                </div>
              </div>
            )}
          </div>
          {((p.status !== 'activ' && p.status !== 'Activă') || Boolean(p.transacted_by_us)) && (
            <div className="absolute inset-0 bg-black/50 z-30 flex flex-col gap-2 items-center justify-center p-4 pointer-events-auto">
              {p.status !== 'activ' && p.status !== 'Activă' && (
                <span className={`text-white font-black text-sm tracking-widest uppercase px-4 py-2 rotate-[-10deg] text-center shadow-lg rounded-sm border-2 border-white ${
                  p.status.toLowerCase().includes('retras') ? 'bg-gray-600' :
                  p.status.toLowerCase().includes('tranzacționat') || p.status.toLowerCase().includes('vândut') || p.status.toLowerCase().includes('închiriat') ? 'bg-green-700' :
                  p.status.toLowerCase().includes('antecontract') ? 'bg-amber-600' :
                  'bg-orange-600'
                }`}>
                  {p.status}
                </span>
              )}
              {Boolean(p.transacted_by_us) && (
                <span className="text-white font-black text-xs tracking-widest uppercase px-3 py-1 rotate-[-10deg] text-center shadow-lg rounded-sm border-2 border-white bg-blue-600">
                  Tranzacționată de noi
                </span>
              )}
            </div>
          )}
        </Link>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <Link href={url} className="block">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">{p.title}</h3>
          <div className="flex gap-3 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
            {p.rooms > 0 && <span>{p.rooms} Camere</span>}
            {p.surface_useable > 0 && <span>{p.surface_useable} mp</span>}
            {p.city && <span>• {p.city}</span>}
          </div>
          <p className="text-gray-500 text-sm line-clamp-3 mb-4">{p.description}</p>
        </Link>
        
        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          <Link href={url} className="text-green-700 font-bold text-sm flex items-center hover:text-green-800 transition-colors">
            Detalii complete &rarr;
          </Link>
          {(p.status === 'activ' || p.status === 'Activă') && (
            <a 
              href={`https://wa.me/40700000000?text=${encodeURIComponent(`Bună ziua, vă contactez în legătură cu anunțul: ${p.title}`)}`}
              target="_blank"
              className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full transition-transform hover:scale-110 shadow-sm"
              title="Scrie pe WhatsApp"
            >
              <WhatsappIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PropertyGrid({ properties, basePath = '/proprietati', hideSearch = false, hidePrices = false }: { properties: any[], basePath?: string, hideSearch?: boolean, hidePrices?: boolean }) {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredProperties = hideSearch ? properties : properties.filter((p) => {
    const term = search.toLowerCase();
    const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? JSON.parse(p.tags) : []);
    
    const matchesSearch = (
      p.title?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) ||
      p.county?.toLowerCase().includes(term) ||
      p.zone?.toLowerCase().includes(term) ||
      tags.some((t: string) => t.toLowerCase().includes(term))
    );

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(p.property_type);

    return matchesSearch && matchesType;
  });

  return (
    <div>
      {/* Search Bar */}
      {!hideSearch && (
        <div className="mb-10">
          <div className="max-w-2xl relative mb-4">
            <input
              type="text"
              placeholder="Caută după oraș, zonă, cuvinte cheie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-12 py-4 rounded-full border-2 border-gray-200 focus:border-green-700 outline-none text-lg shadow-sm transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
          
          {/* Property Type Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {PROPERTY_TYPES.map(type => {
              const isSelected = selectedTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTypes(selectedTypes.filter(t => t !== type.id));
                    } else {
                      setSelectedTypes([...selectedTypes, type.id]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    isSelected 
                      ? 'bg-green-700 text-white shadow-md border-green-700' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-green-600 hover:text-green-700'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          {(search || selectedTypes.length > 0) && (
            <p className="text-sm text-gray-500 mt-4 ml-2">
              Afișez {filteredProperties.length} {filteredProperties.length === 1 ? "rezultat" : "rezultate"}.
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">Nu am găsit anunțuri care să corespundă căutării.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((p: any) => (
            <PropertyCardItem key={p.id} p={p} hidePrices={hidePrices} basePath={basePath} />
          ))}
        </div>
      )}
    </div>
  );
}
