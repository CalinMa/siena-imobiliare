import { notFound } from "next/navigation";
import db from "@/lib/db";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [rows]: any = await db.query('SELECT * FROM properties WHERE slug = ?', [slug]);
  const property = rows[0];

  if (!property) return { title: "Proprietate Inexistentă" };

  return {
    title: `${property.title} | Agenția Siena`,
    description: property.description.substring(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.substring(0, 160),
      images: [
        { url: (typeof property.images === 'string' ? JSON.parse(property.images) : property.images)?.[0] || "" }
      ]
    }
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rows]: any = await db.query('SELECT * FROM properties WHERE slug = ?', [slug]);
  const p = rows[0];

  if (!p) return notFound();

  const images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
  const tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || []);
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header mic de navigare */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-600 hover:text-brand-green transition-colors font-medium">
            &larr; Înapoi la oferte
          </Link>
          <span className="font-bold text-gray-900">{Number(p.price).toLocaleString()} €</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        <div className="mb-6">
          <div className="flex gap-2 text-brand-green font-bold text-sm uppercase tracking-wider mb-2">
            <span>{p.transaction_type}</span>
            <span>•</span>
            <span>{p.property_type}</span>
            {p.city && <span>• {p.city} {p.zone ? `(${p.zone})` : ''}</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">{p.title}</h1>
        </div>
        
        {/* Imagine Principală */}
        <div className="w-full h-[40vh] md:h-[60vh] bg-gray-200 rounded-2xl overflow-hidden mb-6 shadow-md relative">
          {p.status === 'vandut' && (
             <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                 <span className="text-white font-black text-4xl tracking-widest uppercase border-4 border-white px-8 py-3 rotate-[-15deg]">VÂNDUT</span>
             </div>
          )}
          <img src={mainImage} className={`w-full h-full object-cover ${p.status==='vandut' ? 'grayscale' : ''}`} alt={p.title} />
        </div>

        {/* Galerie (daca sunt mai multe imagini) */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {images.slice(1).map((img: string, idx: number) => (
              <div key={idx} className="h-24 md:h-32 bg-gray-200 rounded-xl overflow-hidden shadow-sm">
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Detalii Tehnice */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Caracteristici Principale</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {p.surface_useable > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Suprafață utilă</span>
                <span className="text-xl font-medium text-gray-900">{p.surface_useable} mp</span>
              </div>
            )}
            {p.surface_total > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Suprafață totală</span>
                <span className="text-xl font-medium text-gray-900">{p.surface_total} mp</span>
              </div>
            )}
            {p.surface_land > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Suprafață teren</span>
                <span className="text-xl font-medium text-gray-900">{p.surface_land} mp</span>
              </div>
            )}
            {p.rooms > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Camere</span>
                <span className="text-xl font-medium text-gray-900">{p.rooms}</span>
              </div>
            )}
            {p.bedrooms > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Dormitoare</span>
                <span className="text-xl font-medium text-gray-900">{p.bedrooms}</span>
              </div>
            )}
            {p.bathrooms > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Băi</span>
                <span className="text-xl font-medium text-gray-900">{p.bathrooms}</span>
              </div>
            )}
            {p.floor && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Etaj</span>
                <span className="text-xl font-medium text-gray-900">{p.floor} {p.building_floors > 0 ? `/ ${p.building_floors}` : ''}</span>
              </div>
            )}
            {p.building_construction_year > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">An construcție</span>
                <span className="text-xl font-medium text-gray-900">{p.building_construction_year}</span>
              </div>
            )}
          </div>
          
          {tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Dotări și Facilități</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((t: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm">
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Descriere */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Descriere Proprietate</h2>
          <div className="prose max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed text-lg">
            {p.description}
          </div>
          
          <div className="mt-10 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-center md:text-left">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Preț Solicitat</p>
                <p className="text-4xl font-extrabold text-brand-orange">{Number(p.price).toLocaleString()} €</p>
             </div>
             {p.status === 'activ' && (
               <a href="tel:0700000000" className="bg-brand-green hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-lg w-full md:w-auto text-center">
                 Sună Agentul Acum
               </a>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
