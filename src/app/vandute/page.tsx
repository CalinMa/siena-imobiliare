import Link from "next/link";
import db from "@/lib/db";

export const metadata = {
  title: "Proprietăți Vândute | Agenția Siena",
  description: "Istoricul proprietăților tranzacționate de Agenția Siena. Experiență și rezultate dovedite.",
};

export default async function Vandute() {
  const [rows]: any = await db.query('SELECT * FROM properties WHERE status IN ("vandut", "inchiriat") ORDER BY created_at DESC');
  const properties = rows;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Portofoliu Istoric</h1>
          <p className="text-lg text-gray-600 mb-6">Proprietăți tranzacționate cu succes în ultimii ani de echipa noastră.</p>
          <Link href="/" className="text-green-700 font-medium hover:underline">
            &larr; Înapoi la ofertele active
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Nu există proprietăți vândute în baza de date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p: any) => {
              const images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
              const mainImage = images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
              
              return (
                <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col relative opacity-80 hover:opacity-100 transition-opacity">
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                        <span className="text-orange-600 font-black text-2xl tracking-widest uppercase border-4 border-orange-600 px-6 py-2 rotate-[-15deg]">
                          {p.status === 'inchiriat' || (p.status === 'vandut' && p.transaction_type === 'inchiriere') ? 'ÎNCHIRIAT' : 'VÂNDUT'}
                        </span>
                    </div>
                    <img src={mainImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{p.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
