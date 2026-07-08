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
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{p.title}</h1>
        
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

        {/* Detalii */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
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
