"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, LogOut } from "lucide-react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState<any[]>([]);
  const [editingProp, setEditingProp] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    status: "activ",
    images: [] as string[]
  });

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
      setForm({ title: "", description: "", price: 0, status: "activ", images: [] });
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
      title: p.title,
      description: p.description,
      price: Number(p.price) || 0,
      status: p.status,
      images: typeof p.images === "string" ? JSON.parse(p.images) : (p.images || [])
    });
  };

  const handleAddImage = () => {
    const url = prompt("Introduceți URL-ul imaginii (ex: https://.../poza.jpg)");
    if (url) {
      setForm({ ...form, images: [...form.images, url] });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  if (loading) return <div className="p-10 text-center">Se încarcă...</div>;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Login Siena Admin</h2>
          <input
            type="password"
            className="w-full border rounded-lg px-4 py-2 mb-4"
            placeholder="Parola de acces"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Intră în cont
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panou de Administrare</h1>
          <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 font-medium">
            <LogOut className="w-5 h-5 mr-1" /> Deconectare
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formular Adăugare / Editare */}
          <div className="bg-white p-6 rounded-xl shadow-sm border col-span-1 h-fit">
            <h2 className="text-xl font-bold mb-4">{editingProp ? "Editează Anunț" : "Adaugă Anunț Nou"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titlu Anunț</label>
                <input required type="text" className="w-full border rounded-lg px-3 py-2" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preț (€)</label>
                <input required type="number" className="w-full border rounded-lg px-3 py-2" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="activ">Activ (La vânzare)</option>
                  <option value="vandut">Vândut</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descriere</label>
                <textarea required rows={5} className="w-full border rounded-lg px-3 py-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Imagini (Link-uri externe)</label>
                <div className="space-y-2 mb-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm bg-gray-100 p-2 rounded">
                      <span className="truncate w-full">{img}</span>
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleAddImage} className="text-sm text-blue-600 font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-1"/> Adaugă URL Imagine
                </button>
              </div>
              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                  {editingProp ? "Salvează Modificările" : "Publică Anunț"}
                </button>
                {editingProp && (
                  <button type="button" onClick={() => {setEditingProp(null); setForm({ title: "", description: "", price: 0, status: "activ", images: [] });}} className="px-4 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium">
                    Anulează
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista Anunturi */}
          <div className="bg-white p-6 rounded-xl shadow-sm border col-span-1 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Anunțuri ({properties.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-sm font-semibold">Titlu</th>
                    <th className="p-3 text-sm font-semibold">Preț</th>
                    <th className="p-3 text-sm font-semibold">Status</th>
                    <th className="p-3 text-sm font-semibold text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{p.title}</td>
                      <td className="p-3 text-gray-600">{Number(p.price).toLocaleString()} €</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${p.status === 'activ' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 flex justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                      </td>
                    </tr>
                  ))}
                  {properties.length === 0 && (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nu există niciun anunț în baza de date.</td></tr>
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
