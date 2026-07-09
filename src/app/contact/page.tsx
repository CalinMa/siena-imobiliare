import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import db from "@/lib/db";

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
                    <a href={`tel:${settings.contact_phone}`} className="hover:text-blue-700 transition-colors">{settings.contact_phone || '+40 (000) 000 000'}</a>
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

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trimite un mesaj</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nume complet</label>
                  <input type="text" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="ex: Ion Popescu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input type="tel" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="ex: 07XX XXX XXX" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="ex: adresa@email.ro" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                <textarea rows={4} className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Cu ce te putem ajuta?"></textarea>
              </div>
              <button type="button" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all">
                Trimite Mesajul
              </button>
            </form>

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
