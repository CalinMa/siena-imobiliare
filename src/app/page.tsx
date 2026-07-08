import Link from "next/link";
import db from "@/lib/db";
import PropertyGrid from "@/components/PropertyGrid";

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
          <a href="#anunturi" className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-xl inline-block">
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

        <PropertyGrid properties={properties} />
      </main>
    </div>
  );
}
