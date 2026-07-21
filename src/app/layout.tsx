import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import CookieConsent from "@/components/CookieConsent";

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
  title: "Siena Imobiliare",
  description: "Siena Imobiliare - Experți în imobiliare. Găsește casa visurilor tale sau vinde rapid o proprietate. Portofoliu de anunțuri verificate și servicii premium.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png"
  },
  openGraph: {
    images: ["/icon.png"]
  }
};

import db from '@/lib/db';

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

const formatSocialUrl = (platform: string, url: string) => {
  if (!url) return '';
  url = url.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  if (platform === 'tiktok' && url.startsWith('@')) return `https://www.tiktok.com/${url}`;
  if (platform === 'instagram' && url.startsWith('@')) return `https://www.instagram.com/${url.substring(1)}`;
  if (platform === 'facebook' && !url.includes('/')) return `https://www.facebook.com/${url}`;
  
  return `https://${url}`;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  
  return (
    <html lang="ro" className="scroll-smooth">
      <body className={inter.className}>
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center transform hover:scale-105 transition-transform duration-300">
              <Image src="/logo.jpg" alt="Siena Imobiliare" width={200} height={80} priority className="h-16 md:h-20 w-auto object-contain" />
            </Link>
            
            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-2 font-bold text-gray-700 text-sm tracking-wide uppercase">
              <Link href="/" className="px-5 py-2.5 rounded-full hover:bg-gray-50 hover:text-orange-600 transition-all">Oferte Active</Link>
              <Link href="/vandute" className="px-5 py-2.5 rounded-full hover:bg-gray-50 hover:text-orange-600 transition-all">Portofoliu</Link>
              <Link href="/articole-utile" className="px-5 py-2.5 rounded-full hover:bg-gray-50 hover:text-orange-600 transition-all">Articole Utile</Link>
              <Link href="/contact" className="ml-4 px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-orange-600 hover:shadow-md transform hover:-translate-y-0.5 transition-all">Contact</Link>
            </nav>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
               {settings.social_facebook && <a href={formatSocialUrl('facebook', settings.social_facebook)} target="_blank" aria-label="Facebook" className="p-2 text-gray-600 hover:text-blue-600 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors"><FacebookIcon className="w-5 h-5"/></a>}
               {settings.social_instagram && <a href={formatSocialUrl('instagram', settings.social_instagram)} target="_blank" aria-label="Instagram" className="p-2 text-gray-600 hover:text-pink-600 bg-gray-100 rounded-full hover:bg-pink-50 transition-colors"><InstagramIcon className="w-5 h-5"/></a>}
               {settings.social_tiktok && <a href={formatSocialUrl('tiktok', settings.social_tiktok)} target="_blank" aria-label="TikTok" className="p-2 w-9 h-9 text-gray-600 hover:text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center font-black text-sm">d</a>}
            </div>
          </div>
        </header>

        {children}

        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Siena Imobiliare</h3>
              <p className="text-sm">{settings.agency_description || 'Vindem și preluăm proprietăți.'}</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Link-uri Rapide</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white">Pagina Principală</Link></li>
                <li><Link href="/articole-utile" className="hover:text-white">Articole Utile (Blog)</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/termeni" className="hover:text-white">Termeni și Politici (GDPR)</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Rețele Sociale</h3>
              <div className="flex flex-col gap-2">
                {settings.social_facebook && <a href={formatSocialUrl('facebook', settings.social_facebook)} target="_blank" className="hover:text-white flex items-center gap-2 text-sm"><FacebookIcon className="w-4 h-4"/> Facebook</a>}
                {settings.social_instagram && <a href={formatSocialUrl('instagram', settings.social_instagram)} target="_blank" className="hover:text-white flex items-center gap-2 text-sm"><InstagramIcon className="w-4 h-4"/> Instagram</a>}
                {settings.social_tiktok && <a href={formatSocialUrl('tiktok', settings.social_tiktok)} target="_blank" className="hover:text-white flex items-center gap-2 text-sm font-bold">TikTok</a>}
              </div>
              <div className="mt-4">
                {settings.social_google ? (
                  <a href={formatSocialUrl('google', settings.social_google)} target="_blank" className="hover:text-white flex items-center gap-2 text-sm"><MapPin className="w-4 h-4"/> Google Business Profile</a>
                ) : (
                  <a href="#" target="_blank" className="hover:text-white flex items-center gap-2 text-sm"><MapPin className="w-4 h-4"/> Google Business Profile</a>
                )}
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
            &copy; {new Date().getFullYear()} Siena Imobiliare SRL. Toate drepturile rezervate.
          </div>
        </footer>

        <CookieConsent />
      </body>
    </html>
  );
}
