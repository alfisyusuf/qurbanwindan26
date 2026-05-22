"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Truck, ArrowLeft, CheckCircle2, MapPin, Undo2 } from "lucide-react";
import Link from "next/link";

type PenerimaData = {
  id: string;
  kode_unik: string;
  nama_penerima: string;
  jatah_plastik: number;
  kategori: string;
  kurir_time: string | null;
};

export default function KurirPage() {
  const [daftarAntar, setDaftarAntar] = useState<PenerimaData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDaftarAntar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kupon")
      .select("*")
      .ilike("kategori", "%Pengqurban%")
      .order("kurir_time", { ascending: false, nullsFirst: true }) 
      .order("nama_penerima", { ascending: true });

    if (!error && data) {
      setDaftarAntar(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDaftarAntar();
  }, []);

  // Fungsi untuk menandai sudah terkirim
  const handleTandaiTerkirim = async (id: string, nama: string) => {
    const isConfirm = confirm(`Tandai jatah untuk ${nama} sudah TERKIRIM?`);
    if (!isConfirm) return;

    const { error } = await supabase
      .from("kupon")
      .update({ kurir_time: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      fetchDaftarAntar();
    } else {
      alert("Gagal mengupdate data!");
    }
  };

  // Fungsi EDIT (Undo / Batal Terkirim)
  const handleBatalTerkirim = async (id: string, nama: string) => {
    const isConfirm = confirm(`BATALKAN pengiriman untuk ${nama}? Status akan kembali menjadi belum diantar.`);
    if (!isConfirm) return;

    const { error } = await supabase
      .from("kupon")
      .update({ kurir_time: null }) // Kembalikan ke null (belum dikirim)
      .eq("id", id);

    if (!error) {
      fetchDaftarAntar();
    } else {
      alert("Gagal membatalkan status. Cek koneksi!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-orange-500 text-white p-4 shadow-md rounded-b-3xl mb-6 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-black text-xl flex items-center gap-2">
          <Truck size={24} /> KURIR PAGI
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-400">Memuat daftar antaran...</div>
        ) : daftarAntar.length === 0 ? (
          <div className="text-center py-10 font-bold text-gray-400">Belum ada data Pengqurban.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {daftarAntar.map((item) => (
              <div key={item.id} className={`p-5 rounded-3xl border-2 transition-all ${item.kurir_time ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-orange-200 shadow-lg'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {item.kategori}
                    </span>
                    <h2 className={`font-black text-2xl ${item.kurir_time ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {item.nama_penerima || "Tanpa Nama"}
                    </h2>
                  </div>
                  <div className="bg-orange-100 text-orange-700 font-black text-lg px-3 py-1 rounded-xl">
                    {item.jatah_plastik} Plk
                  </div>
                </div>

                {item.kurir_time ? (
                  // Tampilan jika SUDAH terkirim (dilengkapi tombol Undo/Edit)
                  <div className="flex justify-between items-center bg-green-50 text-green-600 font-bold p-3 rounded-xl mt-4 border border-green-100">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} /> SELESAI DIANTAR
                      </div>
                      <span className="text-xs font-medium text-green-600/70 mt-0.5">
                        Pukul: {new Date(item.kurir_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Tombol Batal/Undo */}
                    <button 
                      onClick={() => handleBatalTerkirim(item.id, item.nama_penerima)}
                      className="p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-colors active:scale-95"
                      title="Batal Terkirim"
                    >
                      <Undo2 size={20} />
                    </button>
                  </div>
                ) : (
                  // Tampilan jika BELUM terkirim
                  <button 
                    onClick={() => handleTandaiTerkirim(item.id, item.nama_penerima)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl mt-2 active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    <MapPin size={20} /> TANDAI TERKIRIM
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}