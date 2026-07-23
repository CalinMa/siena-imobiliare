import React from 'react';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 60;

// Generate metadata for SEO dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [rows]: any = await db.query('SELECT title, meta_title, meta_description, image_url FROM blog_posts WHERE slug = ?', [slug]);
  
  if (!rows || rows.length === 0) return { title: 'Articol inexistent' };
  
  const post = rows[0];
  
  return {
    title: post.meta_title || `${post.title} | Siena`,
    description: post.meta_description || post.title,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.title,
      images: post.image_url ? [post.image_url] : [],
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rows]: any = await db.query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
  
  if (!rows || rows.length === 0) {
    notFound();
  }
  
  const post = rows[0];

  const [relatedRows]: any = await db.query(
    'SELECT title, slug, summary, image_url, published_at FROM blog_posts WHERE slug != ? ORDER BY published_at DESC LIMIT 2',
    [slug]
  );
  
  // Schema.org JSON-LD for rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.meta_title || post.title,
    image: post.image_url ? [post.image_url] : [],
    datePublished: new Date(post.published_at).toISOString(),
    dateModified: new Date(post.updated_at).toISOString(),
    description: post.meta_description || post.summary,
    author: {
      '@type': 'Organization',
      name: 'Siena Imobiliare'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 w-full py-10 md:py-16 bg-slate-50 min-h-screen">
        <article className="max-w-4xl mx-auto px-4 w-full relative">
          
          <div className="mb-8">
            <a href="/articole-utile" className="inline-flex items-center text-gray-500 hover:text-green-700 transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Înapoi la articole
            </a>
          </div>

          <header className="mb-12 text-center w-full">
            <div className="text-green-700 font-bold mb-4">
               {new Date(post.published_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            {post.summary && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {post.summary.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ')}
              </p>
            )}
          </header>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-16">
            {post.image_url && (
              <div className="relative w-full aspect-[21/9] sm:aspect-[16/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-10 md:p-14 lg:p-16">
              {/* 
                 Prose (Tailwind Typography plugin) styling for the WYSIWYG html content.
                 If @tailwindcss/typography is available, 'prose' will style the HTML nicely.
              */}
              <div 
                className="prose prose-lg md:prose-xl prose-green mx-auto max-w-none prose-headings:font-bold prose-img:rounded-xl text-gray-800"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') }}
              />
            </div>
          </div>
          
          {/* Related Articles */}
          {relatedRows && relatedRows.length > 0 && (
            <div className="border-t border-gray-200 pt-16 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Te-ar mai putea interesa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedRows.map((relatedPost: any) => (
                  <a href={`/articole-utile/${relatedPost.slug}`} key={relatedPost.slug} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    {relatedPost.image_url ? (
                      <div className="w-full h-48 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={relatedPost.image_url} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Fără imagine</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-xs font-semibold text-green-700 mb-2">
                        {new Date(relatedPost.published_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-auto">
                        {relatedPost.summary ? relatedPost.summary.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') : ''}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <a href="/articole-utile" className="inline-block bg-white border border-gray-200 text-gray-800 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                  Vezi toate articolele
                </a>
              </div>
            </div>
          )}
          
        </article>
      </main>
    </>
  );
}
