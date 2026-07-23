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
      <main className="flex-1 w-full mt-10 mb-16 bg-white min-h-screen overflow-hidden">
        <article className="max-w-4xl mx-auto px-4 w-full hyphens-auto">
          <header className="mb-12 text-center w-full">
            <div className="text-green-700 font-bold mb-4">
              {new Date(post.published_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight hyphens-auto">
              {post.title}
            </h1>
            {post.summary && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto hyphens-auto">
                {post.summary}
              </p>
            )}
          </header>

          {post.image_url && (
            <div className="relative w-full aspect-[16/9] mb-16 rounded-3xl overflow-hidden shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 
             Prose (Tailwind Typography plugin) styling for the WYSIWYG html content.
             If @tailwindcss/typography is available, 'prose' will style the HTML nicely.
          */}
          <div 
            className="prose prose-lg md:prose-xl prose-green mx-auto max-w-3xl prose-headings:font-bold prose-img:rounded-xl text-gray-800 hyphens-auto max-w-full"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}
