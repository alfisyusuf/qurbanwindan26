"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import QRCode from "react-qr-code";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

type KuponData = {
  id: string;
  kode_unik: string;
  nama_penerima: string | null;
  kategori: string;
  jatah_plastik: number;
};

export default function PrintPage() {
  const [kuponList, setKuponList] = useState<KuponData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKupon = async () => {
      // Mengambil semua data kupon dari database
      const { data, error } = await supabase
        .from("kupon")
        .select("*");

      if (!error && data) {
        // Logika Pengurutan Cerdas (Client-Side)
        const sortedData = data.sort((a, b) => {
          const isAEmpty = !a.nama_penerima || a.nama_penerima.trim() === "";
          const isBEmpty = !b.nama_penerima || b.nama_penerima.trim() === "";

          // Jika A kosong dan B ada namanya, lempar A ke bawah
          if (isAEmpty && !isBEmpty) return 1;
          // Jika A ada namanya dan B kosong, naikkan A ke atas
          if (!isAEmpty && isBEmpty) return -1;
          
          // Jika statusnya sama (sama-sama kosong atau sama-sama ada nama),
          // urutkan secara alfabetis berdasarkan kode uniknya.
          return a.kode_unik.localeCompare(b.kode_unik);
        });

        setKuponList(sortedData);
      }
      setLoading(false);
    };

    fetchKupon();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-bold">Memuat data kupon...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Header Admin - Akan Hilang Saat di-Print */}
      <div className="print:hidden bg-white shadow-sm p-4 flex justify-between items-center mb-6 max-w-5xl mx-auto rounded-b-2xl">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold">
          <ArrowLeft size={20} /> Kembali
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all"
        >
          <Printer size={20} /> Cetak Kertas A4
        </button>
      </div>

      {/* Area Print Kertas A4 */}
      <div className="max-w-5xl mx-auto p-4 print:p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-6 print:gap-4">
          {kuponList.map((kupon) => (
            <div 
              key={kupon.id} 
              // break-inside-avoid memastikan kupon tidak terbelah di antara 2 halaman saat di-print
              className="bg-white border-2 border-dashed border-gray-400 p-4 rounded-xl flex items-center gap-6 break-inside-avoid print:shadow-none shadow-sm"
            >
              {/* Sisi Kiri: QR Code */}
              <div className="bg-white p-2 border border-gray-200 rounded-lg shrink-0">
                <QRCode value={kupon.kode_unik} size={100} level="M" />
              </div>

              {/* Sisi Kanan: Detail Warga & Area Kosong */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {kupon.kode_unik}
                  </span>
                  <span className="font-black text-lg">
                    {kupon.jatah_plastik} Plastik
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-800 text-sm mb-1">{kupon.kategori}</h3>
                
                {/* Garis tulis nama untuk kupon kosongan */}
                {kupon.nama_penerima && kupon.nama_penerima.trim() !== "" ? (
                  <p className="text-xl font-black text-black mt-2">{kupon.nama_penerima}</p>
                ) : (
                  <div className="mt-2">
                    <p className="text-gray-400 text-xl font-bold tracking-[0.15em] overflow-hidden whitespace-nowrap">
                      .......................................
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}