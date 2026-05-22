"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Scale, ArrowLeft, CheckCircle2, Edit2, Save, X } from "lucide-react";
import Link from "next/link";

type HewanData = {
  id: string;
  jenis_hewan: string;
  nomor_urut: number;
  berat_daging_kg: number;
  berat_tulang_kg: number;
};

export default function TimbanganPage() {
  // State Form Utama
  const [jenisHewan, setJenisHewan] = useState("Sapi");
  const [nomorUrut, setNomorUrut] = useState("");
  const [beratDaging, setBeratDaging] = useState("");
  const [beratTulang, setBeratTulang] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State Riwayat & Edit
  const [hewanList, setHewanList] = useState<HewanData[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDaging, setEditDaging] = useState("");
  const [editTulang, setEditTulang] = useState("");

  // Ambil Data Riwayat Timbangan
  const fetchHewan = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("hewan")
      .select("*")
      .order("created_at", { ascending: false }); // Yang baru diinput taruh paling atas

    if (!error && data) {
      setHewanList(data);
    }
    setLoadingList(false);
  };

  useEffect(() => {
    fetchHewan();
  }, []);

  // Simpan Data Baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("hewan").insert([
      {
        jenis_hewan: jenisHewan,
        nomor_urut: parseInt(nomorUrut),
        berat_daging_kg: parseFloat(beratDaging),
        berat_tulang_kg: parseFloat(beratTulang) || 0,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: "Gagal menyimpan data!" });
    } else {
      setMessage({ type: "success", text: `${jenisHewan} Ke-${nomorUrut} Berhasil Dicatat!` });
      setNomorUrut("");
      setBeratDaging("");
      setBeratTulang("");
      fetchHewan(); // Refresh daftar riwayat
    }
  };

  // Fungsi Edit Inline
  const startEdit = (hewan: HewanData) => {
    setEditingId(hewan.id);
    setEditDaging(hewan.berat_daging_kg.toString());
    setEditTulang(hewan.berat_tulang_kg ? hewan.berat_tulang_kg.toString() : "");
  };

  const handleSaveEdit = async (id: string) => {
    const { error } = await supabase
      .from("hewan")
      .update({ 
        berat_daging_kg: parseFloat(editDaging),
        berat_tulang_kg: parseFloat(editTulang) || 0
      })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      fetchHewan(); // Refresh daftar setelah edit
    } else {
      alert("Gagal mengupdate angka. Cek koneksi!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-4 shadow-md rounded-b-3xl mb-8 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-black text-xl flex items-center gap-2">
          <Scale size={24} /> TIMBANGAN
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Notifikasi */}
        {message && (
          <div className={`p-4 rounded-2xl mb-6 font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'success' && <CheckCircle2 size={24} />}
            {message.text}
          </div>
        )}

        {/* Form Input Baru */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-5 mb-8">
          <h2 className="font-black text-gray-800 text-lg border-b pb-2">Catat Timbangan Baru</h2>
          
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button type="button" onClick={() => setJenisHewan("Sapi")}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${jenisHewan === "Sapi" ? "bg-white text-emerald-600 shadow-md" : "text-gray-400"}`}>
              SAPI
            </button>
            <button type="button" onClick={() => setJenisHewan("Kambing")}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${jenisHewan === "Kambing" ? "bg-white text-emerald-600 shadow-md" : "text-gray-400"}`}>
              KAMBING
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-500 mb-1 block">Hewan Ke-</label>
              <input type="number" required min="1" value={nomorUrut} onChange={(e) => setNomorUrut(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 p-4 rounded-2xl text-2xl font-black text-center outline-none focus:border-emerald-500" placeholder="1" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-500 mb-1 block">Daging (Kg)</label>
              <input type="number" step="0.01" required value={beratDaging} onChange={(e) => setBeratDaging(e.target.value)}
                className="w-full bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl text-3xl font-black text-center text-blue-700 outline-none focus:border-blue-500" placeholder="0" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-500 mb-1 block">Tulang (Kg)</label>
              <input type="number" step="0.01" value={beratTulang} onChange={(e) => setBeratTulang(e.target.value)}
                className="w-full bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl text-3xl font-black text-center text-orange-700 outline-none focus:border-orange-500" placeholder="0" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl mt-2 text-xl active:scale-95 transition-transform shadow-lg shadow-emerald-500/30">
            {loading ? "Menyimpan..." : "SIMPAN DATA"}
          </button>
        </form>

        {/* Daftar Riwayat */}
        <div>
          <h2 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">
            Riwayat Timbangan
            <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-lg">{hewanList.length}</span>
          </h2>

          {loadingList ? (
            <div className="text-center text-gray-400 font-bold py-4">Memuat data...</div>
          ) : hewanList.length === 0 ? (
            <div className="text-center text-gray-400 font-bold py-4 bg-white rounded-2xl border border-dashed border-gray-300">Belum ada data tercatat.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {hewanList.map((hewan) => (
                <div key={hewan.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className={`font-black text-lg ${hewan.jenis_hewan === 'Sapi' ? 'text-blue-800' : 'text-orange-800'}`}>
                      {hewan.jenis_hewan.toUpperCase()} #{hewan.nomor_urut}
                    </span>
                    
                    {/* Tombol Aksi Edit/Batal */}
                    {editingId === hewan.id ? (
                      <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-red-500 bg-gray-100 p-2 rounded-lg">
                        <X size={18} />
                      </button>
                    ) : (
                      <button onClick={() => startEdit(hewan)} className="text-gray-400 hover:text-emerald-600 bg-gray-100 p-2 rounded-lg">
                        <Edit2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Mode Edit vs Tampilan Normal */}
                  {editingId === hewan.id ? (
                    <div className="flex items-end gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Daging (kg)</label>
                        <input type="number" step="0.01" value={editDaging} onChange={(e) => setEditDaging(e.target.value)}
                          className="w-full bg-white border border-gray-200 p-2 rounded-lg font-bold outline-none focus:border-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Tulang (kg)</label>
                        <input type="number" step="0.01" value={editTulang} onChange={(e) => setEditTulang(e.target.value)}
                          className="w-full bg-white border border-gray-200 p-2 rounded-lg font-bold outline-none focus:border-emerald-500" />
                      </div>
                      <button onClick={() => handleSaveEdit(hewan.id)} className="bg-emerald-500 text-white p-3 rounded-lg hover:bg-emerald-600 h-[42px]">
                        <Save size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between px-2">
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase">Daging</p>
                        <p className="font-black text-xl text-gray-800">{hewan.berat_daging_kg} <span className="text-sm font-bold text-gray-400">kg</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase">Tulang</p>
                        <p className="font-black text-xl text-gray-800">{hewan.berat_tulang_kg} <span className="text-sm font-bold text-gray-400">kg</span></p>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}