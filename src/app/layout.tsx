import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { MapPin } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agenția Siena Imobiliare",
  description: "Agenția Siena - Experți în imobiliare. Găsește casa visurilor tale sau vinde rapid o proprietate. Portofoliu de anunțuri verificate.",
  icons: {
    icon: "/logo.jpg"
  },
  openGraph: {
    images: ["/logo.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="scroll-smooth">
      <body className={inter.className}>
        <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo.jpg" alt="Siena Imobiliare" className="h-12 w-auto object-contain" />
            </Link>
            <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
              <Link href="/" className="hover:text-orange-600 transition-colors">Oferte Active</Link>
              <Link href="/vandute" className="hover:text-orange-600 transition-colors">Portofoliu</Link>
            </nav>
            <div className="flex items-center gap-4">
               <a href="https://www.facebook.com/sienaimobiliare" target="_blank" className="text-green-700 hover:text-orange-600 transition-colors"><FacebookIcon className="w-5 h-5"/></a>
               <a href="https://instagram.com/" target="_blank" className="text-pink-600 hover:text-pink-800 transition-colors"><InstagramIcon className="w-5 h-5"/></a>
               {/* Minimalist TikTok icon replacement */}
               <a href="https://tiktok.com/" target="_blank" className="text-black hover:text-gray-800 font-black border border-black rounded w-5 h-5 flex items-center justify-center text-[10px] pb-[1px]">d</a>
            </div>
          </div>
        </header>

        {children}

        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Agenția Siena</h3>
              <p className="text-sm">Vindem și preluăm proprietăți. Volum mic, atenție maximă pentru fiecare client. Consultanță premium în imobiliare.</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Linkuri Utile</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white">Anunțuri Active</Link></li>
                <li><Link href="/vandute" className="hover:text-white">Proprietăți Vândute</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Rețele Sociale</h3>
              <div className="flex flex-col gap-2">
                <a href="https://www.facebook.com/sienaimobiliare" target="_blank" className="hover:text-white flex items-center gap-2 text-sm"><FacebookIcon className="w-4 h-4"/> Facebook</a>
                <a href="#" target="_blank" className="hover:text-white flex items-center gap-2 text-sm"><InstagramIcon className="w-4 h-4"/> Instagram (Urmează)</a>
                <a href="#" target="_blank" className="hover:text-white flex items-center gap-2 text-sm font-bold">TikTok (Urmează)</a>
              </div>
              <div className="mt-4">
                <a href="#" target="_blank" className="hover:text-white flex items-center gap-2 text-sm"><MapPin className="w-4 h-4"/> Google Business Profile</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
            &copy; {new Date().getFullYear()} Agenția Siena Imobiliare. Toate drepturile rezervate.
          </div>
        </footer>
      </body>
    </html>
  );
}
