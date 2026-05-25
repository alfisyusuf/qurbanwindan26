"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Printer, CalendarDays, Users, Edit3, CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type UndanganData = {
  id: string;
  namaAsli: string;
  namaEdit: string; // Nama yang bisa diubah sesuka hati di halaman ini
  selected: boolean; // Dicetak atau tidak
};

export default function UndanganPage() {
  const [listUndangan, setListUndangan] = useState<UndanganData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tanggal default sesuai permintaan
  const [tanggalAcara, setTanggalAcara] = useState("Rabu, 27 Mei 2026");
  
  // Format tanggal hari ini untuk TTD (Otomatis)
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const [tanggalTtd, setTanggalTtd] = useState(getTodayDate());

  useEffect(() => {
    const fetchPengqurban = async () => {
      setLoading(true);
      try {
        // Ambil data khusus yang kategorinya Pengqurban
        const { data } = await supabase
          .from("kupon")
          .select("id, nama_penerima")
          .ilike("kategori", "%Pengqurban%")
          .order("nama_penerima", { ascending: true });

        if (data) {
          const formattedData = data.map((item) => ({
            id: item.id,
            namaAsli: item.nama_penerima || "Tanpa Nama",
            namaEdit: item.nama_penerima || "Tanpa Nama",
            selected: true, // Default: semua dicentang untuk dicetak
          }));
          setListUndangan(formattedData);
        }
      } catch (error) {
        console.error("Gagal mengambil data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPengqurban();
  }, []);

  // Fungsi mengubah nama
  const handleNameChange = (id: string, newName: string) => {
    setListUndangan((prev) => 
      prev.map((item) => (item.id === id ? { ...item, namaEdit: newName } : item))
    );
  };

  // Fungsi centang/uncentang 1 orang
  const toggleSelect = (id: string) => {
    setListUndangan((prev) => 
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Fungsi centang/uncentang SEMUA
  const toggleSelectAll = (status: boolean) => {
    setListUndangan((prev) => prev.map((item) => ({ ...item, selected: status })));
  };

  const selectedCount = listUndangan.filter((u) => u.selected).length;
  const dataCetak = listUndangan.filter((u) => u.selected);

  return (
    <div className="min-h-screen bg-gray-100 pb-12 print:bg-white print:pb-0">
      
      {/* CSS KHUSUS PRINT: Memaksa ganti halaman per undangan */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            background-color: white !important;
          }
          .page-break {
            page-break-after: always;
          }
          .page-break:last-child {
            page-break-after: auto; /* Halaman terakhir tidak perlu kosong */
          }
        }
      `}</style>

      {/* ========================================================= */}
      {/* CONTROL PANEL (HILANG SAAT PRINT) */}
      {/* ========================================================= */}
      <div className="print:hidden bg-white shadow-xl mb-8 border-b border-gray-200 p-6 max-w-5xl mx-auto rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-3 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="font-black text-2xl text-gray-800">Cetak Undangan Massal</h1>
            <p className="text-gray-500 text-sm">Pilih pengqurban, edit nama/gelar jika perlu, lalu cetak.</p>
          </div>
        </div>

        {/* Pengaturan Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Tgl Pelaksanaan</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3 text-blue-500" size={18} />
              <input type="text" value={tanggalAcara} onChange={(e) => setTanggalAcara(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Tgl Tanda Tangan</label>
            <div className="relative">
              <Edit3 className="absolute left-3 top-3 text-blue-500" size={18} />
              <input type="text" value={tanggalTtd} onChange={(e) => setTanggalTtd(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* Tabel Daftar Pengqurban */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="bg-gray-100 p-3 flex justify-between items-center border-b border-gray-200">
            <div className="flex gap-2">
              <button onClick={() => toggleSelectAll(true)} className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border shadow-sm hover:bg-gray-50">Centang Semua</button>
              <button onClick={() => toggleSelectAll(false)} className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border shadow-sm hover:bg-gray-50">Batal Semua</button>
            </div>
            <span className="text-sm font-bold text-gray-600 bg-gray-200 px-3 py-1 rounded-lg flex items-center gap-2">
              <Users size={16} /> {selectedCount} Dipilih
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto bg-white p-2 flex flex-col gap-1">
            {loading ? (
              <p className="text-center text-gray-400 font-bold py-6">Mengambil data database...</p>
            ) : listUndangan.length === 0 ? (
              <p className="text-center text-gray-400 font-bold py-6">Tidak ada data Pengqurban ditemukan.</p>
            ) : (
              listUndangan.map((item) => (
                <div key={item.id} className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${item.selected ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50 border-transparent opacity-60'}`}>
                  <button onClick={() => toggleSelect(item.id)} className={`${item.selected ? 'text-blue-600' : 'text-gray-400'}`}>
                    {item.selected ? <CheckSquare size={24} /> : <Square size={24} />}
                  </button>
                  <input 
                    type="text" 
                    value={item.namaEdit} 
                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-semibold text-gray-800 placeholder-gray-400"
                    placeholder="Nama Kosong..."
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tombol Cetak Massal */}
        <button 
          onClick={() => window.print()}
          disabled={selectedCount === 0}
          className="w-full bg-blue-600 disabled:bg-gray-400 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
        >
          <Printer size={24} /> CETAK {selectedCount} UNDANGAN A4
        </button>
      </div>

      {/* ========================================================= */}
      {/* AREA KERTAS PRINT A4 (LOOPING SEJUMLAH YANG DICENTANG) */}
      {/* ========================================================= */}
      <div className="print:w-full print:m-0 w-full max-w-[210mm] mx-auto flex flex-col gap-8 print:gap-0">
        {dataCetak.map((undangan) => (
          <div key={undangan.id} className="page-break bg-white shadow-2xl print:shadow-none p-10 sm:p-16 text-black font-sans w-full min-h-[297mm]">
            
            {/* Kop Surat (Telah diperbarui) */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black uppercase tracking-widest text-gray-900">Panitia Qurban Idul Adha 1447 H</h1>
              <h2 className="text-xl font-bold mt-1 text-gray-800">Masjid Dalan Padhang</h2>
              <p className="text-sm mt-1 text-gray-700 font-medium tracking-wide">
                Windan RT 02 RW 06 Ds. Gumpang, Kec. Kartasura
              </p>
              
              {/* Garis Ganda Kop Surat */}
              <div className="mt-5 border-b-4 border-black relative">
                <div className="absolute w-full border-b-[1.5px] border-black mt-[2px]"></div>
              </div>
            </div>

            {/* Info Surat */}
            <div className="flex justify-between items-start mb-10 text-[15px] font-medium text-gray-800">
              <div>
                <table className="w-full">
                  <tbody>
                    <tr><td className="w-16">Nomor</td><td className="w-4">:</td><td>01/PAN-QRB/2026</td></tr>
                    <tr><td>Lamp.</td><td>:</td><td>-</td></tr>
                    <tr><td>Hal</td><td>:</td><td><strong className="underline">Undangan Menyaksikan Qurban</strong></td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tujuan */}
            <div className="mb-10 text-[15px] text-gray-800">
              <p>Kepada Yth.</p>
              <p className="font-bold text-lg my-1">{undangan.namaEdit}</p>
              <p>di Tempat.</p>
            </div>

            {/* Isi Surat (Font diperbaiki, spacing dilonggarkan) */}
            <div className="text-[15px] leading-relaxed text-justify text-gray-800">
              <p className="mb-4 font-bold">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
              <p className="mb-4">
                Puji syukur senantiasa kita panjatkan kehadirat Allah SWT atas segala limpahan rahmat dan karunia-Nya. Shalawat serta salam semoga senantiasa tercurah kepada junjungan kita, Nabi Muhammad SAW, beserta keluarga, sahabat, dan umatnya yang istiqamah hingga akhir zaman.
              </p>
              <p className="mb-4">
                Sehubungan dengan pelaksanaan Hari Raya Idul Adha dan ibadah penyembelihan hewan qurban, kami selaku panitia mengundang Bapak/Ibu/Saudara/i selaku <strong>Shohibul Qurban</strong> untuk berkenan hadir dan menyaksikan secara langsung proses penyembelihan hewan qurban milik Bapak/Ibu.
              </p>
              <p className="mb-4">Insya Allah pelaksanaan penyembelihan akan diselenggarakan pada:</p>
              
              <div className="ml-8 mb-6">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-32 py-1.5 text-gray-600">Hari, Tanggal</td>
                      <td className="w-4 py-1.5">:</td>
                      <td className="font-bold py-1.5">{tanggalAcara}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-gray-600">Waktu</td>
                      <td className="py-1.5">:</td>
                      <td className="font-bold py-1.5">07.30 WIB - Selesai</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-gray-600 align-top">Tempat</td>
                      <td className="py-1.5 align-top">:</td>
                      <td className="font-bold leading-tight py-1.5">Area IPAL Windan RT 02 / RW 06 <br/> Gumpang, Kartasura</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mb-6">
                Kehadiran Bapak/Ibu sangat kami harapkan untuk menyaksikan kesempurnaan ibadah qurban ini. Semoga amal ibadah qurban Bapak/Ibu diterima oleh Allah SWT dan dicatat sebagai amal saleh. Amin Ya Rabbal 'Alamin.
              </p>

              <p className="mb-8 font-bold">Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
            </div>

            {/* Tanda Tangan */}
            <div className="mt-8 text-[15px] text-gray-800">
              <div className="text-right mb-4">
                <p>Kartasura, {tanggalTtd}</p>
              </div>
              
              <div className="flex justify-between text-center mt-2">
                <div className="w-1/2">
                  <p className="mb-24">Ketua Takmir</p>
                  <p className="font-bold underline tracking-wide">Abdurrahman Fidaulhaq Alhazmiy</p>
                </div>
                <div className="w-1/2">
                  <p className="mb-24">Ketua Panitia Qurban</p>
                  <p className="font-bold underline tracking-wide">Alfi Suryani Yusuf</p>
                </div>
              </div>
            </div>

          </div>
        ))}
        
        {/* Fallback jika kosong di layar */}
        {dataCetak.length === 0 && !loading && (
          <div className="print:hidden text-center py-20 font-bold text-gray-400">
            Centang minimal 1 pengqurban di atas untuk melihat preview surat.
          </div>
        )}
      </div>

    </div>
  );
}