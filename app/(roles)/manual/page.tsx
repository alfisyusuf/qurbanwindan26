"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Search, CheckCircle2, AlertTriangle, Undo2, Hand } from "lucide-react";
import Link from "next/link";

type KuponData = {
  id: string;
  kode_unik: string;
  nama_penerima: string | null;
  jatah_plastik: number;
  status_claim: boolean;
  kategori: string;
};

export default function ManualClaimPage() {
  const [kuponList, setKuponList] = useState<KuponData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"semua" | "belum" | "sudah">("belum"); // Default cari yang belum
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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

  // Logika Pencarian & Filter Otomatis
  const filteredKupon = kuponList.filter((k) => {
    const matchSearch = 
      k.kode_unik.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (k.nama_penerima && k.nama_penerima.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === "belum") return matchSearch && !k.status_claim;
    if (filter === "sudah") return matchSearch && k.status_claim;
    return matchSearch;
  });

  const handleTandaiDiambil = async (id: string, nama: string, plastik: number) => {
    const isConfirm = confirm(`Serahkan ${plastik} Plastik untuk ${nama || "Kupon Kosongan"}?`);
    if (!isConfirm) return;

    setActionLoadingId(id);
    const { error } = await supabase
      .from("kupon")
      .update({ status_claim: true, waktu_claim: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      // Update UI langsung tanpa fetch ulang agar kilat
      setKuponList(prev => prev.map(k => k.id === id ? { ...k, status_claim: true } : k));
    } else {
      alert("Gagal mengupdate data. Cek sinyal internet!");
    }
    setActionLoadingId(null);
  };

  const handleBatal = async (id: string, nama: string) => {
    const isConfirm = confirm(`BATALKAN pengambilan untuk ${nama || "Kupon Kosongan"}?`);
    if (!isConfirm) return;

    setActionLoadingId(id);
    const { error } = await supabase
      .from("kupon")
      .update({ status_claim: false, waktu_claim: null })
      .eq("id", id);

    if (!error) {
      setKuponList(prev => prev.map(k => k.id === id ? { ...k, status_claim: false } : k));
    } else {
      alert("Gagal membatalkan data.");
    }
    setActionLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Darurat (Warna Merah Bata agar beda dari scanner) */}
      <div className="bg-red-600 text-white p-4 shadow-md rounded-b-3xl mb-4 flex items-center justify-between sticky top-0 z-20">
        <Link href="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-black text-xl flex items-center gap-2">
          <Hand size={24} /> MODE MANUAL
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto px-4 sticky top-[72px] z-10 bg-gray-50 pt-2 pb-4">
        {/* Peringatan */}
        <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl mb-4 flex items-start gap-2 border border-red-100">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <p>Gunakan halaman ini HANYA jika Scanner Kamera error atau warga lupa membawa kupon QR.</p>
        </div>

        {/* Kolom Pencarian Kilat */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg font-bold outline-none focus:border-red-500 shadow-sm"
            placeholder="Cari Kode atau Nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Tab */}
        <div className="flex bg-gray-200 p-1 rounded-xl">
          <button onClick={() => setFilter("belum")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'belum' ? 'bg-white text-red-600 shadow' : 'text-gray-500'}`}>
            Belum ({kuponList.filter(k => !k.status_claim).length})
          </button>
          <button onClick={() => setFilter("sudah")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'sudah' ? 'bg-white text-green-600 shadow' : 'text-gray-500'}`}>
            Sudah ({kuponList.filter(k => k.status_claim).length})
          </button>
          <button onClick={() => setFilter("semua")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'semua' ? 'bg-white text-gray-800 shadow' : 'text-gray-500'}`}>
            Semua
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-400">Memuat data...</div>
        ) : filteredKupon.length === 0 ? (
          <div className="text-center py-10 font-bold text-gray-400">Data tidak ditemukan.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredKupon.map((kupon) => (
              <div key={kupon.id} className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row gap-4 justify-between sm:items-center ${kupon.status_claim ? 'bg-gray-100 border-gray-200' : 'bg-white border-red-100 shadow-md'}`}>
                
                {/* Info Warga */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded font-mono">
                      {kupon.kode_unik}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded ${kupon.jatah_plastik > 1 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {kupon.jatah_plastik} PLK
                    </span>
                  </div>
                  <h2 className={`text-xl font-black ${kupon.status_claim ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {kupon.nama_penerima || "KOSONGAN"}
                  </h2>
                </div>

                {/* Tombol Aksi (Besar untuk HP) */}
                <div className="shrink-0 w-full sm:w-auto">
                  {kupon.status_claim ? (
                    <div className="flex items-center justify-between sm:justify-end gap-3 bg-green-50 p-2 rounded-xl border border-green-100">
                      <span className="text-green-600 font-bold text-sm flex items-center gap-1 pl-2">
                        <CheckCircle2 size={16} /> Diambil
                      </span>
                      <button 
                        onClick={() => handleBatal(kupon.id, kupon.nama_penerima || "")}
                        disabled={actionLoadingId === kupon.id}
                        className="p-2 bg-white text-gray-500 rounded-lg shadow-sm border hover:text-red-500"
                      >
                        <Undo2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleTandaiDiambil(kupon.id, kupon.nama_penerima || "", kupon.jatah_plastik)}
                      disabled={actionLoadingId === kupon.id}
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-black py-4 px-6 rounded-xl active:scale-95 transition-transform shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                    >
                      {actionLoadingId === kupon.id ? "..." : "TANDAI SELESAI"}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
