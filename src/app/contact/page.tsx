import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import db from "@/lib/db";

export const revalidate = 60;

export const metadata = {
  title: "Contact | Agenția Siena Imobiliare",
  description: "Contactează-ne pentru orice întrebare sau pentru a programa o vizionare. Siena Imobiliare te ajută să găsești proprietatea perfectă.",
};

async function getSettings() {
  try {
    const [rows]: any = await db.query('SELECT * FROM settings');
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.setting_key] = row.setting_value;
    return settings;
  } catch (e) {
    return {};
  }
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Contactează-ne</h1>
          <p className="text-lg text-gray-600">
            Suntem aici să te ajutăm cu orice întrebare legată de imobiliare. Vino la sediul nostru sau folosește datele de mai jos pentru a lua legătura cu un agent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Contact Form & Info */}
          <div className="p-10 lg:p-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Informații de Contact</h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-700 mt-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Adresă</h3>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    Siena Imobiliare<br/>
                    {settings.contact_address || 'Baicoi, Jud. Prahova'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-700 mt-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Telefon</h3>
                  <p className="text-gray-600 mt-1">
                    <a href={`tel:${settings.contact_phone || '0744177728'}`} className="hover:text-blue-700 transition-colors">{settings.contact_phone || '0744177728'}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-700 mt-1">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">
                    <a href={`mailto:${settings.contact_email}`} className="hover:text-purple-700 transition-colors">{settings.contact_email || 'contact@siena-imobiliare.ro'}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-700 mt-1">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Program</h3>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    Luni - Vineri: 09:00 - 18:00<br/>
                    Sâmbătă: 10:00 - 14:00<br/>
                    Duminică: Închis
                  </p>
                </div>
              </div>
            </div>

            <hr className="mb-10 border-gray-100" />

            <div className="bg-green-50 p-6 md:p-8 rounded-2xl border border-green-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
                <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scrie-ne pe WhatsApp</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Cel mai rapid mod de a lua legătura cu noi! Răspundem aproape instantaneu la orice întrebare.
              </p>
              
              <a 
                href={`https://wa.me/${(settings.contact_whatsapp || '0744177728').replace(/[^0-9]/g, '').replace(/^0/, '40')}?text=${encodeURIComponent('Bună ziua, aș dori să vă contactez în legătură cu serviciile Siena Imobiliare.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
              >
                Deschide Conversația
              </a>
            </div>

          </div>

          {/* Map */}
          <div className="bg-gray-100 relative min-h-[400px] lg:min-h-full">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent('Siena Imobiliare, ' + (settings.contact_address || 'Baicoi'))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}
