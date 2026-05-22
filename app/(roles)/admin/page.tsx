"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Search, UserPlus, Save, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

type KuponData = {
  id: string;
  kode_unik: string;
  nama_penerima: string | null;
  jatah_plastik: number;
  status_claim: boolean;
};

export default function AdminPage() {
  const [kuponList, setKuponList] = useState<KuponData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // State untuk mode edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchKupon = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kupon")
      .select("*")
      .order("kode_unik", { ascending: true });

    if (!error && data) {
      setKuponList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKupon();
  }, []);

  // Filter pencarian (berdasarkan kode atau nama)
  const filteredKupon = kuponList.filter((k) => 
    k.kode_unik.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (k.nama_penerima && k.nama_penerima.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startEdit = (kupon: KuponData) => {
    setEditingId(kupon.id);
    setEditName(kupon.nama_penerima || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    const { error } = await supabase
      .from("kupon")
      .update({ nama_penerima: editName || null })
      .eq("id", id);

    setSaving(false);

    if (!error) {
      // Update UI langsung tanpa fetch ulang agar lebih cepat
      setKuponList(prev => prev.map(k => k.id === id ? { ...k, nama_penerima: editName || null } : k));
      setEditingId(null);
    } else {
      alert("Gagal menyimpan nama. Cek koneksi internet.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-800 text-white p-4 shadow-md rounded-b-3xl mb-6 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-black text-xl flex items-center gap-2">
          <UserPlus size={24} /> UPDATE NAMA
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-xl mx-auto px-4">
        {/* Kolom Pencarian */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg font-bold outline-none focus:border-blue-500 shadow-sm"
            placeholder="Cari Kode (misal: KSG-01) atau Nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-10 font-bold text-gray-400">Memuat data kupon...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredKupon.map((kupon) => (
              <div key={kupon.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Info Kupon */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded text-xs uppercase">
                      {kupon.kode_unik}
                    </span>
                    {kupon.status_claim && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle2 size={12} /> Diambil
                      </span>
                    )}
                  </div>
                  
                  {/* Mode Edit vs Tampilan Normal */}
                  {editingId === kupon.id ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input 
                        type="text" 
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 bg-blue-50 border-2 border-blue-200 px-3 py-2 rounded-xl outline-none font-bold text-gray-800"
                        placeholder="Masukkan nama warga..."
                      />
                    </div>
                  ) : (
                    <h2 className={`text-xl font-black ${kupon.nama_penerima ? 'text-gray-800' : 'text-red-500 italic'}`}>
                      {kupon.nama_penerima || "KOSONGAN"}
                    </h2>
                  )}
                </div>

                {/* Tombol Aksi */}
                <div>
                  {editingId === kupon.id ? (
                    <div className="flex gap-2">
                      <button onClick={cancelEdit} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200">
                        <X size={20} />
                      </button>
                      <button 
                        onClick={() => handleSave(kupon.id)} 
                        disabled={saving}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold flex items-center gap-2"
                      >
                        <Save size={20} /> {saving ? "..." : "Simpan"}
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => startEdit(kupon)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl border border-blue-200 transition-colors"
                    >
                      {kupon.nama_penerima ? "Edit Nama" : "Isi Nama"}
                    </button>
                  )}
                </div>

              </div>
            ))}

            {filteredKupon.length === 0 && (
              <div className="text-center py-10 font-bold text-gray-400">Kupon tidak ditemukan.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}