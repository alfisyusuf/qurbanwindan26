"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart3, Beef, Ticket, Truck, ChevronDown, ChevronUp, CheckCircle2, Clock } from "lucide-react";

type HewanData = {
  id: string;
  jenis_hewan: string;
  nomor_urut: number;
  berat_daging_kg: number;
};

type KuponData = {
  id: string;
  kode_unik: string;
  nama_penerima: string | null;
  kategori: string;
  status_claim: boolean;
  kurir_time: string | null;
};

export default function RekapPage() {
  const [stats, setStats] = useState({
    dagingSapi: 0,
    dagingKambing: 0,
    kuponTotal: 0,
    kuponDiambil: 0,
    kurirTotal: 0,
    kurirSelesai: 0,
  });
  
  // State Lists
  const [hewanList, setHewanList] = useState<HewanData[]>([]);
  const [kuponWargaList, setKuponWargaList] = useState<KuponData[]>([]);
  const [kurirList, setKurirList] = useState<KuponData[]>([]);

  // State Toggles (Accordion)
  const [showDetailHewan, setShowDetailHewan] = useState(false);
  const [showDetailKupon, setShowDetailKupon] = useState(false);
  const [showDetailKurir, setShowDetailKurir] = useState(false);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil & Hitung Data Hewan
        const { data: hewanData } = await supabase
          .from("hewan")
          .select("*")
          .order("jenis_hewan", { ascending: false })
          .order("nomor_urut", { ascending: true });
        
        let dSapi = 0;
        let dKambing = 0;

        if (hewanData) {
          setHewanList(hewanData);
          hewanData.forEach((h) => {
            if (h.jenis_hewan === "Sapi") dSapi += h.berat_daging_kg || 0;
            if (h.jenis_hewan === "Kambing") dKambing += h.berat_daging_kg || 0;
          });
        }

        // 2. Ambil & Pisahkan Data Distribusi (Kupon Warga vs Kurir Pengqurban)
        const { data: kuponData } = await supabase.from("kupon").select("*");
        
        let kTotal = 0;
        let kDiambil = 0;
        let kurTotal = 0;
        let kurSelesai = 0;
        
        const tempKuponWarga: KuponData[] = [];
        const tempKurir: KuponData[] = [];

        if (kuponData) {
          kuponData.forEach((k) => {
            const namaKategori = k.kategori || ""; 

            if (namaKategori.toLowerCase().includes("pengqurban")) {
              kurTotal++;
              if (k.kurir_time) kurSelesai++;
              tempKurir.push(k);
            } else {
              kTotal++;
              if (k.status_claim) kDiambil++;
              tempKuponWarga.push(k);
            }
          });

          // Urutkan List: Yang BELUM (false/null) ditaruh paling ATAS
          tempKuponWarga.sort((a, b) => (a.status_claim === b.status_claim ? 0 : a.status_claim ? 1 : -1));
          tempKurir.sort((a, b) => ((a.kurir_time ? true : false) === (b.kurir_time ? true : false) ? 0 : a.kurir_time ? 1 : -1));

          setKuponWargaList(tempKuponWarga);
          setKurirList(tempKurir);
        }

        setStats({
          dagingSapi: dSapi,
          dagingKambing: dKambing,
          kuponTotal: kTotal,
          kuponDiambil: kDiambil,
          kurirTotal: kurTotal,
          kurirSelesai: kurSelesai,
        });

      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 10000); // Auto refresh 10 detik
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
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-b-[40px] z-0 shadow-lg"></div>

      <div className="relative z-10 max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-wide flex items-center justify-center gap-2 mb-2">
            <BarChart3 size={28} /> LIVE REKAP
          </h1>
          <p className="text-blue-200 font-medium text-sm">Dashboard Transparansi Qurban</p>
        </div>

        {/* 1. Card Timbangan */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl mb-6 transition-all">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowDetailHewan(!showDetailHewan)}>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Beef size={24} /></div>
              <h2 className="font-black text-gray-800 text-lg">Total Daging Murni</h2>
            </div>
            <div className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
              {showDetailHewan ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Sapi</p>
              <p className="text-3xl font-black text-emerald-600">{stats.dagingSapi.toFixed(1)} <span className="text-sm font-bold text-gray-500">Kg</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Kambing</p>
              <p className="text-3xl font-black text-emerald-600">{stats.dagingKambing.toFixed(1)} <span className="text-sm font-bold text-gray-500">Kg</span></p>
            </div>
          </div>

          {showDetailHewan && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Rincian Per Ekor</h3>
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {hewanList.map((hewan) => (
                  <div key={hewan.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="font-bold text-gray-700">{hewan.jenis_hewan} Ke-{hewan.nomor_urut}</span>
                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{hewan.berat_daging_kg} kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Card Kupon Warga */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl mb-6 transition-all">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowDetailKupon(!showDetailKupon)}>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Ticket size={24} /></div>
              <h2 className="font-black text-gray-800 text-lg">Kupon Warga</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-2xl text-blue-600">{persenKupon}%</span>
              <div className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200">
                {showDetailKupon ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div className="bg-blue-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${persenKupon}%` }}></div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-gray-500 font-semibold">Tersalurkan: <span className="text-black font-black">{stats.kuponDiambil}</span></div>
            <div className="text-gray-500 font-semibold">Sisa (Belum): <span className="text-black font-black">{stats.kuponTotal - stats.kuponDiambil}</span></div>
          </div>

          {showDetailKupon && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Daftar Status Pengambilan</h3>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {kuponWargaList.map((kupon) => (
                  <div key={kupon.id} className={`flex justify-between items-center p-3 rounded-xl border shadow-sm ${kupon.status_claim ? 'bg-gray-50 border-gray-100' : 'bg-white border-blue-100'}`}>
                    <div>
                      <p className={`font-bold text-sm ${kupon.status_claim ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {kupon.nama_penerima || "KUPON KOSONGAN"}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{kupon.kode_unik}</p>
                    </div>
                    <div>
                      {kupon.status_claim ? (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 size={14} /> Sudah
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <Clock size={14} /> Belum
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Card Antaran Kurir */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowDetailKurir(!showDetailKurir)}>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Truck size={24} /></div>
              <h2 className="font-black text-gray-800 text-lg">Antaran Pengqurban</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-2xl text-orange-600">{persenKurir}%</span>
              <div className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200">
                {showDetailKurir ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div className="bg-orange-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${persenKurir}%` }}></div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-gray-500 font-semibold">Diantar: <span className="text-black font-black">{stats.kurirSelesai}</span></div>
            <div className="text-gray-500 font-semibold">Belum: <span className="text-black font-black">{stats.kurirTotal - stats.kurirSelesai}</span></div>
          </div>

          {showDetailKurir && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Daftar Status Pengantaran</h3>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {kurirList.map((kurir) => (
                  <div key={kurir.id} className={`flex justify-between items-center p-3 rounded-xl border shadow-sm ${kurir.kurir_time ? 'bg-gray-50 border-gray-100' : 'bg-white border-orange-100'}`}>
                    <div>
                      <p className={`font-bold text-sm ${kurir.kurir_time ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {kurir.nama_penerima || "Tanpa Nama"}
                      </p>
                    </div>
                    <div>
                      {kurir.kurir_time ? (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 size={14} /> Diantar
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <Clock size={14} /> Belum
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}