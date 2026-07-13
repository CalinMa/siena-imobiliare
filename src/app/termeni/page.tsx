import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termeni și Politici GDPR | Siena Imobiliare",
  description: "Termeni, condiții și politica de prelucrare a datelor cu caracter personal (GDPR) ale agenției Siena Imobiliare.",
};

export default function TermeniPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 py-16 px-6 relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Termeni și Politici (GDPR)</h1>
          <p className="text-gray-300 text-lg">Informații legale privind utilizarea platformei Siena Imobiliare</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-8 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-700 font-medium mb-6 transition-colors dark:text-gray-400 dark:hover:text-green-500">
          <ArrowLeft size={20} />
          <span>Înapoi la pagina principală</span>
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700 prose prose-gray dark:prose-invert max-w-none relative">
          
          <h2>1. Introducere</h2>
          <p>
            Prin utilizarea website-ului <strong>Siena Imobiliare</strong>, sunteți de acord cu acești termeni și condiții. 
            Vă rugăm să îi citiți cu atenție. Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu utilizați site-ul nostru.
          </p>

          <h2>2. Datele Companiei</h2>
          <p>
            Site-ul este deținut și administrat de <strong>Siena Imobiliare SRL</strong>.<br/>
            <strong>C.I.F.:</strong> 24034736<br/>
            <strong>Reg. Com.:</strong> J2008001658295<br/>
            <strong>Adresă:</strong> Băicoi, Jud. Prahova (pentru adresa completă, vă rugăm să ne contactați sau să vizitați secțiunea Contact).
          </p>

          <h2>3. Informații Generale</h2>
          <p>
            Informațiile și anunțurile prezentate pe acest website au caracter informativ. Deși facem eforturi pentru a 
            asigura exactitatea datelor despre proprietăți (prețuri, suprafețe, dotări), acestea nu constituie oferte 
            ferme și pot suferi modificări fără notificare prealabilă. Siena Imobiliare nu își asumă responsabilitatea 
            pentru eventualele erori sau omisiuni din textele anunțurilor.
          </p>

          <h2>4. Politica de Prelucrare a Datelor (GDPR)</h2>
          <p>
            Conform Regulamentului (UE) 2016/679 (GDPR) privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor 
            cu caracter personal, <strong>Siena Imobiliare SRL</strong> se angajează să păstreze confidențialitatea datelor dumneavoastră.
          </p>
          
          <h3>4.1. Ce date colectăm?</h3>
          <p>
            Colectăm doar datele pe care ni le furnizați direct, de regulă în momentul în care completați formularul de 
            contact sau ne contactați telefonic/pe WhatsApp. Acestea pot include:
          </p>
          <ul>
            <li>Numele și prenumele</li>
            <li>Adresa de email</li>
            <li>Numărul de telefon</li>
            <li>Informații privind preferințele imobiliare</li>
          </ul>

          <h3>4.2. În ce scop folosim datele?</h3>
          <p>
            Datele dumneavoastră sunt folosite exclusiv pentru a vă putea răspunde la solicitări, pentru a programa vizionări, 
            și pentru a vă oferi informații despre proprietățile de interes. Nu vindem și nu înstrăinăm datele către terți.
          </p>

          <h3>4.3. Drepturile Dumneavoastră</h3>
          <p>
            În baza legislației GDPR, beneficiați de următoarele drepturi privind datele personale:
          </p>
          <ul>
            <li><strong>Dreptul de acces</strong>: Puteți solicita să aflați ce date deținem despre dumneavoastră.</li>
            <li><strong>Dreptul la rectificare</strong>: Puteți cere corectarea datelor incomplete sau inexacte.</li>
            <li><strong>Dreptul la ștergere ("dreptul de a fi uitat")</strong>: Puteți solicita ștergerea datelor din baza noastră.</li>
            <li><strong>Dreptul la restricționarea prelucrării</strong> și <strong>Dreptul de a vă opune</strong>.</li>
          </ul>
          <p>
            Pentru exercitarea acestor drepturi, ne puteți contacta oricând pe datele oficiale din secțiunea <Link href="/contact" className="text-green-700 font-bold hover:underline">Contact</Link>.
          </p>

          <h2>5. Fișiere de tip Cookie</h2>
          <p>
            Site-ul nostru poate folosi module cookie pentru a îmbunătăți experiența de navigare și pentru a obține statistici anonime 
            prin servicii de tip Analytics. Puteți gestiona setările privind cookies din browser-ul dumneavoastră web.
          </p>

          <h2>6. Litigii</h2>
          <p>
            Orice neînțelegere sau litigiu apărut între utilizator și Siena Imobiliare se va încerca a fi rezolvat mai întâi pe 
            cale amiabilă. În caz contrar, competența revine instanțelor judecătorești din România.
          </p>
          
          <hr className="my-10" />
          
          <div className="text-center text-sm text-gray-500">
            <p><strong>Ultima actualizare:</strong> {new Date().toLocaleDateString('ro-RO')}</p>
            <p>
              Pentru orice întrebări referitoare la acești termeni, vă invităm să ne <Link href="/contact" className="text-green-700 hover:underline">contactați</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
