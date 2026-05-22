"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Scale, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TimbanganPage() {
  const [jenisHewan, setJenisHewan] = useState("Sapi");
  const [nomorUrut, setNomorUrut] = useState("");
  const [beratDaging, setBeratDaging] = useState("");
  const [beratTulang, setBeratTulang] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("hewan").insert([
      {
        jenis_hewan: jenisHewan,
        nomor_urut: parseInt(nomorUrut),
        berat_daging_kg: parseFloat(beratDaging),
        berat_tulang_kg: parseFloat(beratTulang) || 0, // Tulang opsional
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: "Gagal menyimpan data!" });
    } else {
      setMessage({ type: "success", text: `${jenisHewan} Ke-${nomorUrut} Berhasil Dicatat!` });
      // Reset form
      setNomorUrut("");
      setBeratDaging("");
      setBeratTulang("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-4 shadow-md rounded-b-3xl mb-8 flex items-center justify-between">
        <Link href="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-black text-xl flex items-center gap-2">
          <Scale size={24} /> TIMBANGAN
        </h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="max-w-md mx-auto px-4">
        {message && (
          <div className={`p-4 rounded-2xl mb-6 font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'success' && <CheckCircle2 size={24} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col gap-5">
          {/* Jenis Hewan Toggle */}
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
              <label className="text-sm font-bold text-gray-500 mb-1 block">Berat Daging (Kg)</label>
              <input type="number" step="0.1" required value={beratDaging} onChange={(e) => setBeratDaging(e.target.value)}
                className="w-full bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl text-3xl font-black text-center text-blue-700 outline-none focus:border-blue-500" placeholder="0.0" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-500 mb-1 block">Berat Tulang (Kg)</label>
              <input type="number" step="0.1" value={beratTulang} onChange={(e) => setBeratTulang(e.target.value)}
                className="w-full bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl text-3xl font-black text-center text-orange-700 outline-none focus:border-orange-500" placeholder="0.0" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl mt-4 text-xl active:scale-95 transition-transform shadow-lg shadow-emerald-500/30">
            {loading ? "Menyimpan..." : "SIMPAN DATA"}
          </button>
        </form>
      </div>
    </div>
  );
}