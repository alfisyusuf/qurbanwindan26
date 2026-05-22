"use client"; // Wajib ditambahkan karena kita pakai hook useRouter dan event onClick

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode, Truck, Scale, LogOut, Printer } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Fungsi untuk memproses log out panitia
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Qurban App</h1>
        <p className="text-gray-500 font-medium mb-8">Pilih akses sesuai tugas Anda di lapangan.</p>

        <div className="flex flex-col gap-4">
          <Link href="/scanner" className="flex items-center gap-4 bg-blue-600 text-white p-4 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
            <div className="bg-white/20 p-3 rounded-xl"><QrCode size={28} /></div>
            <div className="text-left">
              <h2 className="font-bold text-xl">Petugas Scanner</h2>
              <p className="text-blue-100 text-sm">Distribusi daging siang hari</p>
            </div>
          </Link>

          <Link href="/kurir" className="flex items-center gap-4 bg-orange-500 text-white p-4 rounded-2xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all">
            <div className="bg-white/20 p-3 rounded-xl"><Truck size={28} /></div>
            <div className="text-left">
              <h2 className="font-bold text-xl">Petugas Kurir</h2>
              <p className="text-orange-100 text-sm">Antar jatah shohibul pagi hari</p>
            </div>
          </Link>

          <Link href="/timbangan" className="flex items-center gap-4 bg-emerald-500 text-white p-4 rounded-2xl shadow-lg hover:bg-emerald-600 active:scale-95 transition-all">
            <div className="bg-white/20 p-3 rounded-xl"><Scale size={28} /></div>
            <div className="text-left">
              <h2 className="font-bold text-xl">Petugas Timbangan</h2>
              <p className="text-emerald-100 text-sm">Input berat daging sapi/kambing</p>
            </div>
          </Link>
          <Link href="/print" className="flex items-center gap-4 bg-gray-800 text-white p-4 rounded-2xl shadow-lg hover:bg-gray-900 active:scale-95 transition-all">
            <div className="bg-white/20 p-3 rounded-xl"><Printer size={28} /></div>
            <div className="text-left">
              <h2 className="font-bold text-xl">Cetak Kupon</h2>
              <p className="text-gray-300 text-sm">Print QR Code ke kertas A4</p>
            </div>
          </Link>
        </div>

        {/* Tombol Logout */}
        <button 
          onClick={handleLogout} 
          className="mt-8 flex items-center justify-center gap-2 w-full text-gray-400 font-semibold hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          Keluar dari Akun
        </button>
      </div>
    </main>
  );
}