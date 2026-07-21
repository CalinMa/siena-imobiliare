'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// React-Quill-New requires dynamic import with ssr: false in Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const emptyForm = {
    title: '',
    summary: '',
    content: '',
    image_url: '',
    meta_title: '',
    meta_description: ''
  };

  const [form, setForm] = useState(emptyForm);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    fetch('/api/admin/blog')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(err => console.error(err));
  };

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setEditingPost(null);
    setForm(() => ({
      title: '',
      summary: '',
      content: '',
      image_url: '',
      meta_title: '',
      meta_description: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const url = editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog';
    const method = editingPost ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      resetForm();
      loadPosts();
      showToast('Articol salvat cu succes!');
    } else {
      showToast('Eroare la salvare.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ești sigur că vrei să ștergi acest articol?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadPosts();
      showToast('Articol șters.');
    } else {
      showToast('Eroare la ștergere.', 'error');
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      summary: post.summary || '',
      content: post.content || '',
      image_url: post.image_url || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || ''
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Presupunem un upload preset, trebuie sa verific cum e in admin page

    try {
      // Get settings for cloudinary cloud name from existing DB or use environment if available
      // Actually, Siena uses /api/admin/upload for Cloudinary upload, let's use that.
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setForm({...form, image_url: data.url});
      }
    } catch (err) {
      console.error(err);
      showToast("Eroare la incarcare imagine", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Left side: Form */}
      <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">{editingPost ? "Editează Articol" : "Adaugă Articol Nou"}</h2>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Titlu Articol *</label>
            <input 
              type="text" 
              required
              className="w-full border rounded-lg px-3 py-2" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Rezumat (Summary) - apare în listing</label>
            <textarea 
              className="w-full border rounded-lg px-3 py-2 h-20" 
              value={form.summary} 
              onChange={e => setForm({...form, summary: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Imagine Copertă (Profil)</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                onChange={handleFileUpload} 
                disabled={isUploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {isUploading && <span className="text-sm text-gray-500">Se încarcă...</span>}
            </div>
            {form.image_url && (
              <div className="mt-4 relative w-48 h-32 rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Cover preview" className="object-cover w-full h-full" />
                <button type="button" onClick={() => setForm({...form, image_url: ''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">x</button>
              </div>
            )}
          </div>

          <div className="pb-12">
            <label className="block text-sm font-semibold mb-1">Conținut Articol (Wysiwyg) *</label>
            <div className="h-64 mb-10">
              <ReactQuill 
                theme="snow" 
                value={form.content} 
                onChange={(val) => setForm({...form, content: val})} 
                className="h-full"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="submit" className="bg-green-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-800 transition-colors">
              {editingPost ? "Salvează Modificările" : "Publică Articolul"}
            </button>
            {editingPost && (
              <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors">
                Anulează
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Right side: List */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2">Articole Publicate ({posts.length})</h2>
        <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2">
          {posts.map(post => (
            <div key={post.id} className={`p-4 rounded-xl border bg-white ${editingPost?.id === post.id ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'}`}>
              <div className="flex gap-4">
                {post.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image_url} alt="cover" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-400">Fara poza</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{post.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">/{post.slug}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(post.published_at).toLocaleDateString('ro-RO')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button onClick={() => handleEdit(post)} className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-lg font-semibold text-sm transition-colors">
                  Editează
                </button>
                <button onClick={() => handleDelete(post.id)} className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded-lg font-semibold text-sm transition-colors">
                  Șterge
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Nu ai adăugat niciun articol încă.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
