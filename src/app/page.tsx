import Link from "next/link";
import db from "@/lib/db";

export const metadata = {
  title: "Agenția Siena | Anunțuri Imobiliare de Top",
  description: "Găsește proprietatea perfectă alături de Agenția Siena. Descoperă portofoliul nostru exclusivist.",
};

export default async function Home() {
  const [rows]: any = await db.query('SELECT * FROM properties WHERE status = "activ" ORDER BY created_at DESC');
  const properties = rows;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-gray-900 text-white text-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        
        <div className="relative z-20 max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-md">Găsește casa visurilor tale</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light drop-shadow">Portofoliu exclusivist de proprietăți selectate cu grijă.</p>
          <a href="#anunturi" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-xl inline-block">
            Vezi Ofertele
          </a>
        </div>
      </section>

      <main id="anunturi" className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Anunțuri Recente</h2>
            <p className="text-gray-500 mt-2">Explorează cele mai noi proprietăți adăugate în portofoliu.</p>
          </div>
          <Link href="/vandute" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-medium transition-colors">
            Vezi portofoliul istoric &rarr;
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Momentan nu avem anunțuri active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p: any) => {
              const images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
              const mainImage = images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
              
              return (
                <Link href={`/proprietati/${p.slug}`} key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img src={mainImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                      {Number(p.price).toLocaleString()} €
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{p.description}</p>
                    <div className="text-blue-600 font-medium text-sm flex items-center mt-auto">
                      Detalii complete &rarr;
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
