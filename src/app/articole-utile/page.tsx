import React from 'react';
import db from '@/lib/db';
import Link from 'next/link';

export const metadata = {
  title: 'Articole Utile & Noutăți Imobiliare | Siena',
  description: 'Descoperă cele mai noi tendințe pe piața imobiliară, sfaturi pentru cumpărători și vânzători și informații utile de la experții Siena.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
  const [rows]: any = await db.query('SELECT id, title, slug, summary, image_url, published_at FROM blog_posts ORDER BY published_at DESC');

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full mt-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Articole Utile & Noutăți</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fii la curent cu cele mai noi tendințe de pe piața imobiliară. Descoperă ghiduri, sfaturi și analize pentru a lua cea mai bună decizie.
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nu există articole momentan</h3>
            <p className="text-gray-500">Revenim curând cu informații valoroase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rows.map((post: any) => (
              <Link key={post.id} href={`/articole-utile/${post.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  {post.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span>Fără imagine</span>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-sm font-semibold text-green-700 mb-3">
                    {new Date(post.published_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors line-clamp-2 hyphens-auto">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-1 hyphens-auto">
                    {post.summary}
                  </p>
                  
                  <div className="text-green-700 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                    Citește articolul
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
  );
}
