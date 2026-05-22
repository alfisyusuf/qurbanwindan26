"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Truck, ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";

type KuponData = {
  id: string;
  kode_unik: string;
  nama_penerima: string;
  jatah_plastik: number;
  status_claim: boolean;
};

export default function KurirPage() {
  const [daftarAntar, setDaftarAntar] = useState<KuponData[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data yang metode_distribusi-nya 'Diantar'
  const fetchDaftarAntar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kupon")
      .select("*")
      .eq("metode_distribusi", "Diantar")
      .order("status_claim", { ascending: true }) // Yang belum diantar taruh atas
      .order("nama_penerima", { ascending: true });

    if (!error && data) {
      setDaftarAntar(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDaftarAntar();
  }, []);

  const handleTandaiTerkirim = async (id: string, nama: string) => {
    const isConfirm = confirm(`Tandai jatah ${nama} sudah TERKIRIM?`);
    if (!isConfirm) return;

    const { error } = await supabase
      .from("kupon")
      .update({ status_claim: true, waktu_claim: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      // Refresh data agar pindah ke bawah / berubah status
      fetchDaftarAntar();
    } else {
      alert("Gagal mengupdate data!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4 shadow-md rounded-b-3xl mb-6 flex items-center justify-between">
        <Link href="/" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-black text-xl flex items-center gap-2">
          <Truck size={24} /> KURIR JATAH
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-400">Memuat rute antaran...</div>
        ) : daftarAntar.length === 0 ? (
          <div className="text-center py-10 font-bold text-gray-400">Tidak ada jadwal antaran.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {daftarAntar.map((item) => (
              <div key={item.id} className={`p-5 rounded-3xl border-2 transition-all ${item.status_claim ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-orange-200 shadow-lg'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.kode_unik}</span>
                    <h2 className={`font-black text-2xl ${item.status_claim ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {item.nama_penerima}
                    </h2>
                  </div>
                  <div className="bg-orange-100 text-orange-700 font-black text-lg px-3 py-1 rounded-xl">
                    {item.jatah_plastik} Plk
                  </div>
                </div>

                {item.status_claim ? (
                  <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-3 rounded-xl justify-center mt-4">
                    <CheckCircle2 size={20} /> SELESAI DIANTAR
                  </div>
                ) : (
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