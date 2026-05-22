"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart3, Beef, Ticket, Truck } from "lucide-react";

export default function RekapPage() {
  const [stats, setStats] = useState({
    dagingSapi: 0,
    dagingKambing: 0,
    kuponTotal: 0,
    kuponDiambil: 0,
    kurirTotal: 0,
    kurirSelesai: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Ambil data hewan
      const { data: hewanData } = await supabase.from("hewan").select("*");
      
      let dSapi = 0;
      let dKambing = 0;

      if (hewanData) {
        hewanData.forEach((h) => {
          if (h.jenis_hewan === "Sapi") dSapi += h.berat_daging_kg;
          if (h.jenis_hewan === "Kambing") dKambing += h.berat_daging_kg;
        });
      }

      // Ambil data distribusi (Kupon & Kurir)
      const { data: kuponData } = await supabase.from("kupon").select("*");
      
      let kTotal = 0;
      let kDiambil = 0;
      let kurTotal = 0;
      let kurSelesai = 0;

      if (kuponData) {
        kuponData.forEach((k) => {
          if (k.kategori.toLowerCase().includes("pengqurban")) {
            kurTotal++;
            if (k.kurir_time) kurSelesai++;
          } else {
            kTotal++;
            if (k.status_claim) kDiambil++;
          }
        });
      }

      setStats({
        dagingSapi: dSapi,
        dagingKambing: dKambing,
        kuponTotal: kTotal,
        kuponDiambil: kDiambil,
        kurirTotal: kurTotal,
        kurirSelesai: kurSelesai,
      });

      setLoading(false);
    };

    fetchData();

    // Auto-refresh setiap 10 detik agar realtime
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const persenKupon = stats.kuponTotal === 0 ? 0 : Math.round((stats.kuponDiambil / stats.kuponTotal) * 100);
  const persenKurir = stats.kurirTotal === 0 ? 0 : Math.round((stats.kurirSelesai / stats.kurirTotal) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-12 font-sans relative">
      {/* Background Ornamen */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-b-[40px] z-0 shadow-lg"></div>

      <div className="relative z-10 max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-wide flex items-center justify-center gap-2 mb-2">
            <BarChart3 size={28} /> LIVE REKAP
          </h1>
          <p className="text-blue-200 font-medium text-sm">Dashboard Transparansi Qurban</p>
        </div>

        {/* Card Timbangan */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Beef size={24} /></div>
            <h2 className="font-black text-gray-800 text-lg">Total Daging Murni</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Sapi</p>
              <p className="text-3xl font-black text-emerald-600">{stats.dagingSapi.toFixed(1)} <span className="text-sm font-bold text-gray-500">Kg</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Kambing</p>
              <p className="text-3xl font-black text-emerald-600">{stats.dagingKambing.toFixed(1)} <span className="text-sm font-bold text-gray-500">Kg</span></p>
            </div>
          </div>
        </div>

        {/* Card Kupon Warga */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Ticket size={24} /></div>
              <h2 className="font-black text-gray-800 text-lg">Kupon Warga</h2>
            </div>
            <span className="font-black text-2xl text-blue-600">{persenKupon}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div className="bg-blue-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${persenKupon}%` }}></div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-gray-500 font-semibold">Tersalurkan: <span className="text-black font-black">{stats.kuponDiambil}</span></div>
            <div className="text-gray-500 font-semibold">Sisa: <span className="text-black font-black">{stats.kuponTotal - stats.kuponDiambil}</span></div>
          </div>
        </div>

        {/* Card Antaran Kurir */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Truck size={24} /></div>
              <h2 className="font-black text-gray-800 text-lg">Antaran Pengqurban</h2>
            </div>
            <span className="font-black text-2xl text-orange-600">{persenKurir}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div className="bg-orange-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${persenKurir}%` }}></div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-gray-500 font-semibold">Diantar: <span className="text-black font-black">{stats.kurirSelesai}</span></div>
            <div className="text-gray-500 font-semibold">Belum: <span className="text-black font-black">{stats.kurirTotal - stats.kurirSelesai}</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}