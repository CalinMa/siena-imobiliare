"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, LogOut, ChevronRight, Eye, CheckCircle, AlertCircle, GripVertical } from "lucide-react";
import { ROMANIA_DATA, ROMANIA_NEIGHBORHOODS } from "@/lib/locationData";
import { CRM_TAGS } from "@/lib/crmTags";
import Image from "next/image";
import QRCode from "react-qr-code";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState<any[]>([]);
  const [editingProp, setEditingProp] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [isUploading, setIsUploading] = useState(false);
  const [draggedImgIdx, setDraggedImgIdx] = useState<number | null>(null);
  const [adminTab, setAdminTab] = useState<'anunturi' | 'cont'>('anunturi');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const emptyForm = {
    title: "", description: "", price: 0, currency: "EUR", status: "Activă", images: [] as string[],
    transaction_type: "vanzare", property_type: "apartament", county: "", city: "", zone: "", address: "", transacted_by_us: false,
    surface_useable: 0, surface_total: 0, surface_land: 0,
    rooms: 0, bedrooms: 0, bathrooms: 0, floor: "", building_floors: 0, building_construction_year: 0,
    partitioning: "", comfort: "", tags: [] as string[], video_link: "", virtual_tour_link: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [newTag, setNewTag] = useState("");

  const availableCounties = Object.keys(ROMANIA_DATA).sort();
  const availableCities = form.county && ROMANIA_DATA[form.county] ? [...ROMANIA_DATA[form.county]].sort() : [];
  const availableZones = form.city && ROMANIA_NEIGHBORHOODS[form.city] ? [...ROMANIA_NEIGHBORHOODS[form.city]].sort() : null;

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          loadProperties();
          loadSettings();
        }
        setLoading(false);
      });
  }, []);

  const loadSettings = () => {
    fetch("/api/admin/settings", { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setSettings(data);
        else console.error("API error:", data);
      })
      .catch(err => console.error("Fetch error:", err));
  };

  const loadProperties = () => {
    fetch("/api/admin/properties", { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProperties(data);
        else console.error("API error:", data);
      })
      .catch(err => console.error("Fetch error:", err));
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      showToast("Autentificare reușită!");
      loadProperties();
    } else {
      showToast("Parolă incorectă!", "error");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    showToast("Te-ai deconectat cu succes.");
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
      showToast("Anunțul a fost salvat cu succes!");
    } else {
      showToast("Eroare la salvare.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Sigur dorești să ștergi acest anunț?")) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    loadProperties();
    showToast("Anunțul a fost șters.");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
    if (res.ok) showToast("Setări salvate cu succes!");
    else showToast("Eroare la salvarea setărilor.", "error");
  };

  const handleEdit = (p: any) => {
    setEditingProp(p);
    
    let currentStatus = p.status;
    if (currentStatus === 'activ') currentStatus = 'Activă';
    if (currentStatus === 'vandut') currentStatus = 'Vândut';
    if (currentStatus === 'inchiriat' || currentStatus === 'Închiriat') currentStatus = 'Închiriată';
    if (currentStatus === 'Antecontract / Rezervat') currentStatus = 'Antecontract / Rezervată';
    if (currentStatus === 'Retrasa') currentStatus = 'Retrasă';

    setForm({
      ...emptyForm,
      ...p,
      status: currentStatus || "Activă",
      currency: p.currency || "EUR",
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
      transacted_by_us: Boolean(p.transacted_by_us),
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
          showToast("Eroare la încărcarea imaginii.", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Eroare la încărcare.", "error");
      }
    }
    
    setForm({ ...form, images: newImages });
    setIsUploading(false);
    
    // Reset input
    e.target.value = '';
  };

  const handleSettingsHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setSettings({...settings, hero_image: data.url});
        showToast("Imagine de fundal încărcată!");
      } else {
        showToast("Eroare la încărcarea imaginii.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Eroare la încărcare.", "error");
    }
    
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
      
      {/* Sistem de Notificări (Toast) */}
      {toast && (
        <div className={`fixed bottom-4 right-4 md:top-4 md:bottom-auto md:right-4 z-[100] flex items-center gap-3 px-4 py-3 min-w-[300px] bg-white rounded-xl shadow-2xl border border-gray-100 border-l-4 transition-all transform animate-in slide-in-from-bottom-4 md:slide-in-from-top-4 ${toast.type === 'error' ? 'border-l-red-500' : 'border-l-green-500'}`}>
          {toast.type === 'success' ? (
            <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
          ) : (
            <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className={`font-bold text-sm ${toast.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
              {toast.type === 'success' ? 'Succes' : 'Eroare'}
            </h4>
            <p className="text-gray-600 text-sm font-medium leading-tight mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Panou de Administrare</h1>
          <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 font-medium bg-red-50 px-4 py-2 rounded-lg">
            <LogOut className="w-5 h-5 mr-1" /> Deconectare
          </button>
        </div>

        <div className="flex border-b mb-8 gap-8">
          <button 
            className={`py-3 font-bold text-lg border-b-4 transition-colors ${adminTab === 'anunturi' ? 'border-green-700 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setAdminTab('anunturi')}
          >
            Gestionare Anunțuri
          </button>
          <button 
            className={`py-3 font-bold text-lg border-b-4 transition-colors ${adminTab === 'cont' ? 'border-green-700 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setAdminTab('cont')}
          >
            Contul Meu (Setări)
          </button>
        </div>

        {adminTab === 'anunturi' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Formular Adăugare / Editare */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border lg:overflow-hidden flex flex-col lg:h-[calc(100vh-120px)] lg:sticky lg:top-[100px] mb-24 lg:mb-0">
            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 relative">
              <div className="bg-gray-900 p-4 shrink-0 flex justify-between items-center rounded-t-xl lg:rounded-none">
                <h2 className="text-xl font-bold text-white">{editingProp ? "Editează Anunțul" : "Adaugă Anunț"}</h2>
                <div className="hidden lg:flex gap-2">
                  {editingProp && (
                    <button type="button" onClick={() => {setEditingProp(null); setForm(emptyForm);}} className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-xs font-medium">
                      Anulează
                    </button>
                  )}
                  <button type="submit" className="px-4 py-1.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 text-sm shadow-md">
                    {editingProp ? "Salvează" : "Publică"}
                  </button>
                </div>
              </div>
              
              <div className="flex border-b text-sm font-medium shrink-0 bg-white">
                <button type="button" className={`flex-1 py-3 ${activeTab === 'general' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('general')}>General</button>
                <button type="button" className={`flex-1 py-3 ${activeTab === 'tehnic' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('tehnic')}>Tehnic</button>
                <button type="button" className={`flex-1 py-3 ${activeTab === 'media' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('media')}>Media</button>
                <button type="button" className={`flex-1 py-3 ${activeTab === 'dotari' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('dotari')}>Dotări</button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                
                {/* TAB 1: GENERAL */}
                <div className={activeTab === 'general' ? 'space-y-4' : 'hidden'}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Titlu Anunț</label>
                    <input required type="text" className="w-full border rounded-lg px-3 py-2 min-w-0" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tip Tranzacție</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.transaction_type} onChange={e => {
                      setForm({...form, transaction_type: e.target.value});
                    }}>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Județ</label>
                    <select className="w-full border rounded-lg px-3 py-2 min-w-0" value={form.county} onChange={e => setForm({...form, county: e.target.value, city: "", zone: ""})}>
                      <option value="">- Alege Județ -</option>
                      {availableCounties.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Localitate</label>
                    <select className="w-full border rounded-lg px-3 py-2 min-w-0" value={form.city} onChange={e => setForm({...form, city: e.target.value, zone: ""})} disabled={!form.county}>
                      <option value="">- Alege Localitate -</option>
                      {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zonă / Cartier</label>
                    {availableZones ? (
                      <select className="w-full border rounded-lg px-3 py-2 min-w-0" value={form.zone} onChange={e => setForm({...form, zone: e.target.value})}>
                        <option value="">- Alege Cartier -</option>
                        {availableZones.map(z => <option key={z} value={z}>{z}</option>)}
                      </select>
                    ) : (
                      <input type="text" placeholder="ex: Gheorgheni" className="w-full border rounded-lg px-3 py-2" value={form.zone} onChange={e => setForm({...form, zone: e.target.value})} disabled={!form.city} />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Adresă Exactă pt Hartă</label>
                    <input type="text" placeholder="ex: Strada Florilor nr. 10" className="w-full border rounded-lg px-3 py-2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Preț și Monedă</label>
                    <div className="flex gap-2">
                      <input required type="number" className="flex-1 border rounded-lg px-3 py-2 min-w-0" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
                      <select className="w-24 border rounded-lg px-3 py-2 bg-gray-50 font-bold shrink-0" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
                        <option value="EUR">€ EUR</option>
                        <option value="RON">RON</option>
                        <option value="USD">$ USD</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={e => {
                      const newStatus = e.target.value;
                      const isClosed = ['Vândut', 'Închiriată', 'Tranzacționată de noi', 'Tranzacționată de alții'].includes(newStatus);
                      setForm({...form, status: newStatus, transacted_by_us: isClosed ? form.transacted_by_us : false});
                    }}>
                      <option value="Activă">Activă</option>
                      <option value="Incompletă">Incompletă</option>
                      <option value="Antecontract / Rezervată">Antecontract / Rezervată</option>
                      {form.transaction_type === 'vanzare' && <option value="Vândut">Vândut</option>}
                      {form.transaction_type === 'inchiriere' && <option value="Închiriată">Închiriată</option>}
                      <option value="Retrasă">Retrasă</option>
                      {/* Past options kept for backwards compatibility */}
                      {form.status === 'Tranzacționată de noi' && <option value="Tranzacționată de noi">Tranzacționată de noi (vechi)</option>}
                      {form.status === 'Tranzacționată de alții' && <option value="Tranzacționată de alții">Tranzacționată de alții (vechi)</option>}
                    </select>
                    <label className={`flex items-center gap-2 mt-3 ${['Vândut', 'Închiriată', 'Tranzacționată de noi', 'Tranzacționată de alții'].includes(form.status) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`} title={!['Vândut', 'Închiriată', 'Tranzacționată de noi', 'Tranzacționată de alții'].includes(form.status) ? "Disponibil doar pentru status Vândut sau Închiriată" : ""}>
                      <input type="checkbox" disabled={!['Vândut', 'Închiriată', 'Tranzacționată de noi', 'Tranzacționată de alții'].includes(form.status)} className="w-5 h-5 rounded border-gray-300 text-green-600 disabled:bg-gray-200" checked={form.transacted_by_us} onChange={e => setForm({...form, transacted_by_us: e.target.checked})} />
                      <span className="text-sm font-medium text-gray-700">Tranzacționată de noi</span>
                    </label>
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
                  {form.property_type !== 'teren' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500">Suprafață utilă (mp)</label>
                        <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.surface_useable} onChange={e => setForm({...form, surface_useable: Number(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-500">Suprafață totală (mp)</label>
                        <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.surface_total} onChange={e => setForm({...form, surface_total: Number(e.target.value)})} />
                      </div>
                    </>
                  )}
                  {form.property_type !== 'apartament' && (
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500">Suprafață teren (mp)</label>
                      <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.surface_land} onChange={e => setForm({...form, surface_land: Number(e.target.value)})} />
                    </div>
                  )}
                </div>
                {form.property_type !== 'teren' && (
                  <>
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
                  </>
                )}
              </div>

              {/* TAB 3: MEDIA */}
              <div className={activeTab === 'media' ? 'space-y-4' : 'hidden'}>
                <div>
                  <label className="block text-sm font-medium mb-2">Imagini</label>
                  <div className="space-y-2 mb-2">
                    {form.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        draggable
                        onDragStart={() => setDraggedImgIdx(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedImgIdx === null || draggedImgIdx === idx) return;
                          const newImages = [...form.images];
                          const draggedImg = newImages[draggedImgIdx];
                          newImages.splice(draggedImgIdx, 1);
                          newImages.splice(idx, 0, draggedImg);
                          setForm({...form, images: newImages});
                          setDraggedImgIdx(null);
                        }}
                        onDragEnd={() => setDraggedImgIdx(null)}
                        className={`flex items-center justify-between gap-2 text-sm p-2 rounded cursor-grab active:cursor-grabbing border ${
                          draggedImgIdx === idx ? 'opacity-50 bg-gray-50' : 
                          idx === 0 ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <Image src={img} width={56} height={40} className="object-cover rounded" alt="Thumbnail" />
                          <div className="flex flex-col">
                            <span className={`font-bold text-xs ${idx === 0 ? 'text-green-700' : 'text-gray-600'}`}>
                              {idx === 0 ? "🌟 Imagine Principală" : `Imagine ${idx + 1}`}
                            </span>
                          </div>
                        </div>
                        <button type="button" onClick={() => {
                          const n = [...form.images]; n.splice(idx,1); setForm({...form, images: n});
                        }} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ))}
                  </div>
                  <label className="text-sm text-green-700 font-medium flex w-fit cursor-pointer items-center border border-green-700 rounded px-3 py-1 hover:bg-green-50 disabled:opacity-50">
                    <Plus className="w-4 h-4 mr-1"/> {isUploading ? "Se încarcă..." : "Încarcă Imagini"}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-1">Link Video (YouTube, Instagram, TikTok, Facebook)</label>
                    <input type="text" placeholder="ex: https://youtube.com/watch?v=..." className="w-full border rounded-lg px-3 py-2" value={form.video_link} onChange={e => setForm({...form, video_link: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Link Tur Virtual (3D)</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={form.virtual_tour_link} onChange={e => setForm({...form, virtual_tour_link: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* TAB 4: DOTARI */}
              <div className={activeTab === 'dotari' ? 'space-y-6' : 'hidden'}>
                <p className="text-sm text-gray-500 mb-4">Selectează facilitățile și dotările proprietății (se vor salva automat în anunț):</p>
                {Object.entries(CRM_TAGS).map(([category, tags]) => (
                  <div key={category} className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 border-b pb-1 text-sm">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => {
                        const isSelected = form.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
                              } else {
                                setForm({ ...form, tags: [...form.tags, tag] });
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              isSelected 
                                ? 'bg-green-100 border-green-300 text-green-800 shadow-sm' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Sticky Mobile Action Bar */}
            <div className="lg:hidden sticky bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-3 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] rounded-b-xl">
              {editingProp && (
                <button type="button" onClick={() => {setEditingProp(null); setForm(emptyForm);}} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-bold">
                  Anulează
                </button>
              )}
              <button type="submit" className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-extrabold hover:bg-green-500 shadow-md text-center text-lg">
                {editingProp ? "Salvează Modificările" : "Publică Anunțul"}
              </button>
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
                          <Image src={images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200'} width={64} height={48} className="object-cover rounded shadow-sm" alt="Thumbnail" />
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-gray-900 line-clamp-1">{p.title}</div>
                          <div className="text-xs text-gray-500 capitalize">{p.transaction_type} • {p.property_type}</div>
                        </td>
                        <td className="p-3 font-bold text-orange-600">{Number(p.price).toLocaleString()} {p.currency === 'RON' ? 'RON' : p.currency === 'USD' ? '$' : '€'}{p.transaction_type === 'inchiriere' ? ' / lună' : ''}</td>
                        <td className="p-3 flex flex-col gap-1 items-start">
                          <span className={`px-2 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${p.status === 'Activă' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                            {p.status}
                          </span>
                          {p.transacted_by_us ? (
                            <span className="px-2 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                              Tranzacționată de noi
                            </span>
                          ) : null}
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
        ) : (
          <div className="max-w-4xl bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">Setări Agenție</h2>
            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">1. Preferințe Afișare</h3>
                <label className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" className="w-6 h-6 text-green-600 rounded" checked={settings.mix_portfolio === 'true'} onChange={e => setSettings({...settings, mix_portfolio: e.target.checked ? 'true' : 'false'})} />
                  <div>
                    <div className="font-bold">Afișează portofoliul istoric pe Prima Pagină</div>
                    <div className="text-sm text-gray-500">Dacă este bifat, vizitatorii vor vedea anunțurile vândute/închiriate alături de cele active.</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" className="w-6 h-6 text-green-600 rounded" checked={settings.hide_prices_on_cards === 'true'} onChange={e => setSettings({...settings, hide_prices_on_cards: e.target.checked ? 'true' : 'false'})} />
                  <div>
                    <div className="font-bold">Ascunde prețurile pe cardurile de anunțuri</div>
                    <div className="text-sm text-gray-500">Dacă este bifat, prețurile nu vor fi afișate pe pozele anunțurilor în lista de proprietăți.</div>
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">2. Prezentare Agenție</h3>
                <div>
                  <label className="block font-medium mb-1 text-sm">Titlu Principal (Hero) - Prima Pagină</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" value={settings.hero_title || ''} onChange={e => setSettings({...settings, hero_title: e.target.value})} placeholder="Găsește casa visurilor tale" />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm">Subtitlu Principal (Hero) - Prima Pagină</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" value={settings.hero_subtitle || ''} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} placeholder="Portofoliu exclusivist de proprietăți selectate cu grijă." />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm">Imagine Principală (Hero) - Prima Pagină</label>
                  <div className="flex gap-4 items-start">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 text-gray-600 px-6 py-4 rounded-xl font-bold flex flex-col items-center justify-center transition flex-1 text-center h-32">
                      <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      Încarcă o imagine nouă din PC
                      <input type="file" className="hidden" accept="image/*" onChange={handleSettingsHeroUpload} />
                    </label>
                    {settings.hero_image && (
                      <div className="relative w-48 h-32 rounded-xl overflow-hidden border shadow-sm group">
                        <Image src={settings.hero_image} fill className="object-cover" alt="Hero Image" />
                        <button type="button" onClick={() => setSettings({...settings, hero_image: ''})} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-sm">Descriere Agenție (Footer)</label>
                  <textarea rows={3} className="w-full border rounded-lg px-3 py-2" value={settings.agency_description || ''} onChange={e => setSettings({...settings, agency_description: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">3. Date de Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-sm">Număr Telefon (Apel)</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={settings.contact_phone || ''} onChange={e => setSettings({...settings, contact_phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-sm">Număr WhatsApp</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={settings.contact_whatsapp || ''} onChange={e => setSettings({...settings, contact_whatsapp: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1 text-sm">Adresă de Email</label>
                    <input type="email" className="w-full border rounded-lg px-3 py-2" value={settings.contact_email || ''} onChange={e => setSettings({...settings, contact_email: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1 text-sm">Google Place ID (Pentru Recenzii și Hartă)</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={settings.google_place_id || ''} onChange={e => setSettings({...settings, google_place_id: e.target.value})} placeholder="Ex: ChIJbyZfK66vtKsRGQ086pQASl4" />
                    <p className="text-xs text-gray-500 mt-1">Acest ID este folosit pentru a afișa recenziile pe prima pagină și harta pe pagina de Contact.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">4. Rețele Sociale</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-1 text-sm">Facebook Link</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={settings.social_facebook || ''} onChange={e => setSettings({...settings, social_facebook: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-sm">Instagram Link</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={settings.social_instagram || ''} onChange={e => setSettings({...settings, social_instagram: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-sm">TikTok Link</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" value={settings.social_tiktok || ''} onChange={e => setSettings({...settings, social_tiktok: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">5. Integrare Imografic</h3>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <label className="block font-bold text-purple-900 mb-2 text-sm">Imografic API Key</label>
                  <input 
                    type="password" 
                    className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500" 
                    value={settings.imografic_api_key || ''} 
                    onChange={e => setSettings({...settings, imografic_api_key: e.target.value})} 
                    placeholder="imo_key_xxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                  />
                  <p className="text-xs text-purple-700 mt-2">
                    Lipește aici token-ul generat din contul tău de pe Imografic. Anunțurile se vor sincroniza automat la fiecare salvare.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">6. Coduri QR Utile (Print/Afișe)</h3>
                <div className="bg-white p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* QR Code - Website */}
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="font-bold mb-4 text-center">Cod QR - Prima Pagină Site</h4>
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                      <QRCode id="qr-website" value="https://sienaimobiliare.ro" size={180} level="H" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        const svg = document.getElementById('qr-website');
                        if (!svg) return;
                        const svgData = new XMLSerializer().serializeToString(svg);
                        const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'QR_Site_Siena.svg';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      Descarcă Vectorial (SVG)
                    </button>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Acest cod duce vizitatorii direct pe https://sienaimobiliare.ro
                    </p>
                  </div>

                  {/* QR Code - Google Reviews */}
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="font-bold mb-4 text-center">Cod QR - Recenzii Google</h4>
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                      <QRCode 
                        id="qr-reviews" 
                        value={settings.google_place_id ? `https://search.google.com/local/writereview?placeid=${settings.google_place_id}` : "https://google.com"} 
                        size={180} 
                        level="H" 
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!settings.google_place_id) {
                          alert('Te rog să adaugi un Google Place ID mai sus (secțiunea 3) și să salvezi setările.');
                          return;
                        }
                        const svg = document.getElementById('qr-reviews');
                        if (!svg) return;
                        const svgData = new XMLSerializer().serializeToString(svg);
                        const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'QR_Recenzii_Google.svg';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      Descarcă Vectorial (SVG)
                    </button>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      {settings.google_place_id 
                        ? 'Acest cod va deschide pagina voastră de recenzii Google.' 
                        : 'Lipsește Google Place ID. Completează-l mai sus!'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <button type="submit" className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-800 shadow-lg">
                  Salvează Setările
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
