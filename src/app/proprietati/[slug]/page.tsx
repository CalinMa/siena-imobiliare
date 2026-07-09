import { notFound } from "next/navigation";
import db from "@/lib/db";
import Link from "next/link";
import { Metadata } from "next";
import VideoEmbed from "@/components/VideoEmbed";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyGrid from "@/components/PropertyGrid";
import { CRM_TAGS } from "@/lib/crmTags";

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

export default async function PropertyPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  let settings: Record<string, string> = {};
  try {
    const [sRows]: any = await db.query('SELECT * FROM settings');
    for (const row of sRows) settings[row.setting_key] = row.setting_value;
  } catch(e) {}

  const [rows]: any = await db.query('SELECT * FROM properties WHERE slug = ?', [params.slug]);
  const p = rows[0];

  if (!p) return notFound();

  const images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
  const tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || []);
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';

  const groupedTags: Record<string, string[]> = {};
  if (tags.length > 0) {
    tags.forEach((tag: string) => {
      let foundCategory = "Alte caracteristici";
      for (const [cat, catTags] of Object.entries(CRM_TAGS)) {
        if (catTags.includes(tag)) {
          foundCategory = cat;
          break;
        }
      }
      if (!groupedTags[foundCategory]) groupedTags[foundCategory] = [];
      groupedTags[foundCategory].push(tag);
    });
  }

  const [similarRows]: any = await db.query(
    'SELECT * FROM properties WHERE status IN ("activ", "Activă") AND id != ? AND property_type = ? AND transaction_type = ? ORDER BY created_at DESC LIMIT 3',
    [p.id, p.property_type, p.transaction_type]
  );
  let similar = similarRows;

  if (similar.length < 3) {
    const idsToExclude = [p.id, ...similar.map((s: any) => s.id)];
    const placeholders = idsToExclude.map(() => '?').join(',');
    const [otherRows]: any = await db.query(
      `SELECT * FROM properties WHERE status IN ("activ", "Activă") AND id NOT IN (${placeholders}) ORDER BY created_at DESC LIMIT ?`,
      [...idsToExclude, 3 - similar.length]
    );
    similar = [...similar, ...otherRows];
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header mic de navigare */}
      <div className="bg-white border-b sticky top-20 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-600 hover:text-green-700 transition-colors font-medium">
            &larr; Înapoi la oferte
          </Link>
          <span className="font-bold text-gray-900">{Number(p.price).toLocaleString()} {p.currency === 'RON' ? 'RON' : p.currency === 'USD' ? '$' : '€'}</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 text-green-700 font-bold text-sm uppercase tracking-wider mb-2">
            <span>{p.transaction_type}</span>
            <span>•</span>
            <span>{p.property_type}</span>
            {p.county && <span>• {p.county}</span>}
            {p.city && <span>• {p.city} {p.zone ? `(${p.zone})` : ''}</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">{p.title}</h1>
        </div>
        
        {/* Imagine Principală & Galerie cu Lightbox */}
        <PropertyGallery 
          images={images} 
          title={p.title} 
          status={p.status} 
          transactionType={p.transaction_type} 
        />

        {/* Video Embed */}
        {p.video_link && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 w-full text-left">Video / Tur Virtual</h2>
            <VideoEmbed url={p.video_link} />
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
            {p.bathrooms > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm uppercase tracking-wider font-bold">Băi</span>
                <span className="text-xl font-medium text-gray-900">{p.bathrooms}</span>
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
          
          {Object.keys(groupedTags).length > 0 && (
            <div className="mt-10 pt-8 border-t space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">Dotări și Facilități</h3>
              {Object.entries(groupedTags).map(([category, catTags]) => (
                <div key={category}>
                  <h4 className="font-bold text-gray-600 mb-3 text-sm uppercase tracking-wider">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {catTags.map((t: string, idx: number) => (
                      <span key={idx} className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-full font-medium text-sm shadow-sm flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Descriere */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Descriere Proprietate</h2>
          <div className="prose max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed text-lg">
            {p.description}
          </div>
          
          
          <div className="mt-10 pt-8 border-t flex flex-col items-center justify-between gap-6">
             <div className="text-center w-full">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Preț Solicitat</p>
                <p className="text-4xl font-extrabold text-orange-600 mb-6">{Number(p.price).toLocaleString()} {p.currency === 'RON' ? 'RON' : p.currency === 'USD' ? '$' : '€'}</p>
             </div>
             
             {(p.status === 'activ' || p.status === 'Activă') && (
               <div className="w-full flex flex-col md:flex-row gap-4 justify-center">
                 <a href={`tel:${settings.contact_phone || '0700000000'}`} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-md flex-1">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                   Sună Acum
                 </a>
                 <a href={`https://wa.me/${(settings.contact_whatsapp || '0700000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bună ziua, vă contactez în legătură cu anunțul: ${p.title}`)}`} target="_blank" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-md flex-1">
                   <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                   WhatsApp
                 </a>
                 <a href={`mailto:${settings.contact_email || 'contact@sienaimobiliare.ro'}?subject=Informații anunț: ${encodeURIComponent(p.title)}`} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-4 rounded-xl font-bold text-lg transition-transform transform hover:scale-105 shadow-md flex-1">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                   Trimite Mail
                 </a>
               </div>
             )}
          </div>
        </div>

        {/* Localizare Hartă */}
        {(p.address || p.zone || p.city) && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Localizare</h2>
            <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gray-200 mb-4 shadow-inner">
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                loading="lazy" 
                allowFullScreen 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${p.address ? p.address + ', ' : ''}${p.zone ? p.zone + ', ' : ''}${p.city ? p.city + ', ' : ''}${p.county ? p.county + ', ' : ''}Romania`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
            <div className="flex justify-center mt-6">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.address ? p.address + ', ' : ''}${p.zone ? p.zone + ', ' : ''}${p.city ? p.city + ', ' : ''}${p.county ? p.county + ', ' : ''}Romania`)}`}
                target="_blank"
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-colors border shadow-sm w-full md:w-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Navighează spre adresă
              </a>
            </div>
          </div>
        )}

        {/* Proprietăți Similare */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">Proprietăți Similare</h2>
            <PropertyGrid properties={similar} hideSearch={true} />
          </div>
        )}
      </main>
    </div>
  );
}
