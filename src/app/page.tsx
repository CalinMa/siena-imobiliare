import Link from "next/link";
import db from "@/lib/db";
import PropertyGrid from "@/components/PropertyGrid";
import GoogleReviewsMarquee from "@/components/GoogleReviewsMarquee";

export const metadata = {
  title: "Agenția Siena | Anunțuri Imobiliare de Top",
  description: "Găsește proprietatea perfectă alături de Agenția Siena. Descoperă portofoliul nostru exclusivist.",
};

export default async function Home() {
  let settings: Record<string, string> = {};
  try {
    const [sRows]: any = await db.query('SELECT * FROM settings');
    for (const row of sRows) settings[row.setting_key] = row.setting_value;
  } catch(e) {}

  let properties = [];
  if (settings.mix_portfolio === 'true') {
    const [rows]: any = await db.query('SELECT * FROM properties ORDER BY created_at DESC');
    properties = rows;
  } else {
    const [rows]: any = await db.query('SELECT * FROM properties WHERE status IN ("activ", "Activă") ORDER BY created_at DESC');
    properties = rows;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="relative w-full h-[85vh] min-h-[600px] flex flex-col bg-gray-900 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${settings.hero_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000'}')` }} />
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full pt-12 md:pt-0">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight drop-shadow-md">{settings.hero_title || 'Găsește casa visurilor tale'}</h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-6 md:mb-8 font-light drop-shadow">{settings.hero_subtitle || 'Portofoliu exclusivist de proprietăți selectate cu grijă.'}</p>
            <a href="#anunturi" className="bg-green-700 hover:bg-green-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-xl inline-block">
              Vezi Ofertele
            </a>
          </div>
        </div>
        
        <div className="relative z-20 w-full pb-8 md:pb-12">
          <GoogleReviewsMarquee />
        </div>
      </section>

      <main id="anunturi" className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{settings.mix_portfolio === 'true' ? 'Portofoliul Nostru' : 'Anunțuri Recente'}</h2>
            <p className="text-gray-500 mt-2">Explorează cele mai noi proprietăți adăugate în portofoliu.</p>
          </div>
          {settings.mix_portfolio !== 'true' && (
            <Link href="/vandute" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-medium transition-colors">
              Vezi portofoliul istoric &rarr;
            </Link>
          )}
        </div>

        <PropertyGrid properties={properties} />
      </main>
    </div>
  );
}
