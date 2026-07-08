"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, LogOut, ChevronRight, Eye } from "lucide-react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState<any[]>([]);
  const [editingProp, setEditingProp] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [isUploading, setIsUploading] = useState(false);

  const emptyForm = {
    title: "", description: "", price: 0, status: "activ", images: [] as string[],
    transaction_type: "vanzare", property_type: "apartament", city: "", zone: "",
    surface_useable: 0, surface_total: 0, surface_land: 0,
    rooms: 0, bedrooms: 0, bathrooms: 0, floor: "", building_floors: 0, building_construction_year: 0,
    partitioning: "", comfort: "", tags: [] as string[], video_link: "", virtual_tour_link: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        if (data.authenticated) loadProperties();
        setLoading(false);
      });
  }, []);

  const loadProperties = () => {
    fetch("/api/admin/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data));
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      loadProperties();
    } else {
      alert("Parolă incorectă!");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const url = editingProp ? `/api/admin/properties/${editingProp.id}` : "/api/admin/properties";
    const method = editingProp ? "PUT" : "POST";
    
    const res = await fetch(url, {
      method,
      body: JSON.stringify(form),
    });
    
    if (res.ok) {
      setEditingProp(null);
      setForm(emptyForm);
      setActiveTab("general");
      loadProperties();
    } else {
      alert("Eroare la salvare.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Sigur dorești să ștergi acest anunț?")) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    loadProperties();
  };

  const handleEdit = (p: any) => {
    setEditingProp(p);
    setForm({
      ...emptyForm,
      ...p,
      price: Number(p.price) || 0,
      surface_useable: Number(p.surface_useable) || 0,
      surface_total: Number(p.surface_total) || 0,
      surface_land: Number(p.surface_land) || 0,
      rooms: Number(p.rooms) || 0,
      bedrooms: Number(p.bedrooms) || 0,
      bathrooms: Number(p.bathrooms) || 0,
      building_floors: Number(p.building_floors) || 0,
      building_construction_year: Number(p.building_construction_year) || 0,
      images: typeof p.images === "string" ? JSON.parse(p.images) : (p.images || []),
      tags: typeof p.tags === "string" ? JSON.parse(p.tags) : (p.tags || []),
    });
    setActiveTab("general");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const newImages = [...form.images];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          newImages.push(data.url);
        } else {
          alert("Eroare la încărcarea imaginii.");
        }
      } catch (err) {
        console.error(err);
        alert("Eroare la încărcare.");
      }
    }
    
    setForm({ ...form, images: newImages });
    setIsUploading(false);
    
    // Reset input
    e.target.value = '';
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setForm({ ...form, tags: [...form.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  if (loading) return <div className="p-10 text-center">Se încarcă...</div>;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Login Siena Admin</h2>
          <input type="password" className="w-full border rounded-lg px-4 py-2 mb-4" placeholder="Parola de acces" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800">Intră în cont</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panou de Administrare</h1>
          <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 font-medium">
            <LogOut className="w-5 h-5 mr-1" /> Deconectare
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Formular Adăugare / Editare */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col h-fit">
            <div className="bg-gray-900 p-4">
              <h2 className="text-xl font-bold text-white">{editingProp ? "Editează Anunțul" : "Adaugă Anunț Nou"}</h2>
            </div>
            
            <div className="flex border-b text-sm font-medium">
              <button className={`flex-1 py-3 ${activeTab === 'general' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('general')}>General</button>
              <button className={`flex-1 py-3 ${activeTab === 'tehnic' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('tehnic')}>Detalii Tehnice</button>
              <button className={`flex-1 py-3 ${activeTab === 'media' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('media')}>Media & Dotări</button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              
              {/* TAB 1: GENERAL */}
              <div className={activeTab === 'general' ? 'space-y-4' : 'hidden'}>
                <div>
                  <label className="block text-sm font-medium mb-1">Titlu Anunț</label>
                  <input required type="text" className="w-full border rounded-lg px-3 py-2" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tip Tranzacție</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.transaction_type} onChange={e => setForm({...form, transaction_type: e.target.value})}>
                      <option value="vanzare">Vânzare</option>
                      <option value="inchiriere">Închiriere</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tip Proprietate</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.property_type} onChange={e => setForm({...form, property_type: e.target.value})}>
                      <option value="apartament">Apartament</option>
                      <option value="casa">Casă / Vilă</option>
                      <option value="teren">Teren</option>
                      <option value="comercial">Spațiu Comercial</option>
                      <option value="birouri">Birouri</option>
                      <option value="industrial">Spațiu Industrial</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Localitate</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zonă</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={form.zone} onChange={e => setForm({...form, zone: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Preț (€)</label>
                    <input required type="number" className="w-full border rounded-lg px-3 py-2" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="activ">Activ (La vânzare)</option>
                      <option value="vandut">Vândut / Tranzacționat</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descriere</label>
                  <textarea required rows={6} className="w-full border rounded-lg px-3 py-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
              </div>

              {/* TAB 2: TEHNIC */}
              <div className={activeTab === 'tehnic' ? 'space-y-4' : 'hidden'}>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">Suprafață utilă (mp)</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.surface_useable} onChange={e => setForm({...form, surface_useable: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">Suprafață totală (mp)</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.surface_total} onChange={e => setForm({...form, surface_total: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">Suprafață teren (mp)</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.surface_land} onChange={e => setForm({...form, surface_land: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Camere</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.rooms} onChange={e => setForm({...form, rooms: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dormitoare</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Băi</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Etaj</label>
                    <input type="text" placeholder="ex: 2" className="w-full border rounded-lg px-3 py-2" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">Etaje Clădire</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.building_floors} onChange={e => setForm({...form, building_floors: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">An Const.</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.building_construction_year} onChange={e => setForm({...form, building_construction_year: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Compartimentare</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.partitioning} onChange={e => setForm({...form, partitioning: e.target.value})}>
                      <option value="">- Alege -</option>
                      <option value="decomandat">Decomandat</option>
                      <option value="semidecomandat">Semidecomandat</option>
                      <option value="nedecomandat">Nedecomandat</option>
                      <option value="circular">Circular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confort</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.comfort} onChange={e => setForm({...form, comfort: e.target.value})}>
                      <option value="">- Alege -</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="lux">Lux</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* TAB 3: MEDIA */}
              <div className={activeTab === 'media' ? 'space-y-4' : 'hidden'}>
                <div>
                  <label className="block text-sm font-medium mb-2">Imagini</label>
                  <div className="space-y-2 mb-2">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-sm bg-gray-100 p-2 rounded">
                        <span className="truncate flex-1 max-w-[200px]">{img}</span>
                        <img src={img} className="h-8 w-12 object-cover rounded" />
                        <button type="button" onClick={() => {
                          const n = [...form.images]; n.splice(idx,1); setForm({...form, images: n});
                        }} className="text-red-500 hover:text-red-700 ml-2"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ))}
                  </div>
                  <label className="text-sm text-green-700 font-medium flex w-fit cursor-pointer items-center border border-green-700 rounded px-3 py-1 hover:bg-green-50 disabled:opacity-50">
                    <Plus className="w-4 h-4 mr-1"/> {isUploading ? "Se încarcă..." : "Încarcă Imagini"}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-1">Link Video (YouTube, Instagram, TikTok, Facebook)</label>
                    <input type="text" placeholder="ex: https://youtube.com/watch?v=..." className="w-full border rounded-lg px-3 py-2" value={form.video_link} onChange={e => setForm({...form, video_link: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Link Tur Virtual (3D)</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={form.virtual_tour_link} onChange={e => setForm({...form, virtual_tour_link: e.target.value})} />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium mb-2">Dotări (Tag-uri)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {tag} <button type="button" onClick={() => {
                           const n = [...form.tags]; n.splice(idx,1); setForm({...form, tags: n});
                        }} className="text-gray-500 hover:text-red-500">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="ex: Aer Condiționat" className="flex-1 border rounded-lg px-3 py-2 text-sm" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} />
                    <button type="button" onClick={handleAddTag} className="bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">Adaugă</button>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex gap-3 mt-4">
                <button type="submit" className="flex-1 bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 shadow-md">
                  {editingProp ? "Salvează Modificările" : "Publică Anunțul"}
                </button>
                {editingProp && (
                  <button type="button" onClick={() => {setEditingProp(null); setForm(emptyForm);}} className="px-6 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium">
                    Anulează
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista Anunturi */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border h-fit">
            <h2 className="text-xl font-bold mb-4">Portofoliu Curent ({properties.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-500">
                    <th className="p-3 text-xs uppercase font-semibold">Imagine</th>
                    <th className="p-3 text-xs uppercase font-semibold">Informații</th>
                    <th className="p-3 text-xs uppercase font-semibold">Preț</th>
                    <th className="p-3 text-xs uppercase font-semibold">Status</th>
                    <th className="p-3 text-xs uppercase font-semibold text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => {
                    const images = typeof p.images === "string" ? JSON.parse(p.images) : (p.images || []);
                    return (
                      <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3 w-20">
                          <img src={images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200'} className="w-16 h-12 object-cover rounded shadow-sm" />
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-gray-900 line-clamp-1">{p.title}</div>
                          <div className="text-xs text-gray-500 capitalize">{p.transaction_type} • {p.property_type}</div>
                        </td>
                        <td className="p-3 font-bold text-orange-600">{Number(p.price).toLocaleString()} €</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${p.status === 'activ' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 flex justify-end gap-2">
                          <a href={`/proprietati/${p.slug}`} target="_blank" className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Vezi pe site"><Eye className="w-4 h-4"/></a>
                          <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editează"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Șterge"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    );
                  })}
                  {properties.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nu există niciun anunț în baza de date.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
