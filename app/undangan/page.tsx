"use client";

import { useState } from "react";
import { ArrowLeft, Printer, User, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function UndanganPage() {
  const [namaPenerima, setNamaPenerima] = useState("Bapak/Ibu Fulan");
  const [tanggal, setTanggal] = useState("Minggu, 10 Dzulhijjah 1447 H");

  return (
    <div className="min-h-screen bg-gray-200 pb-12 print:bg-white print:pb-0">
      
      {/* Aturan khusus untuk mode Print (Kertas A4) */}
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
        }
      `}</style>

      {/* Control Panel (HILANG SAAT DI-PRINT) */}
      <div className="print:hidden bg-white shadow-md p-6 mb-8 rounded-b-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link href="/" className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <h1 className="font-black text-xl text-gray-800">Cetak Undangan</h1>
        </div>

        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            {/* Mengganti UserEdit menjadi User agar tidak error */}
            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              value={namaPenerima}
              onChange={(e) => setNamaPenerima(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-gray-700 outline-none focus:border-blue-500"
              placeholder="Nama Penerima..."
            />
          </div>
          <div className="flex-1 relative">
            <CalendarDays className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-gray-700 outline-none focus:border-blue-500"
              placeholder="Hari, Tanggal..."
            />
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
        >
          <Printer size={20} /> CETAK A4
        </button>
      </div>

      {/* Kertas Preview A4 */}
      <div className="bg-white shadow-2xl print:shadow-none mx-auto w-full max-w-[210mm] min-h-[297mm] p-10 sm:p-16 print:p-0 text-black font-serif">
        
        {/* Kop Surat */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black uppercase tracking-wide">Panitia Qurban Idul Adha 1447 H</h1>
          <h2 className="text-xl font-bold mt-1">Warga Windan RT 02 RW 06</h2>
          <p className="text-sm mt-1 text-gray-700">Ds. Gumpang, Kec. Kartasura, Kab. Sukoharjo</p>
          
          {/* Garis Ganda Kop Surat */}
          <div className="mt-4 border-b-4 border-black relative">
            <div className="absolute w-full border-b border-black mt-[2px]"></div>
          </div>
        </div>

        {/* Info Surat */}
        <div className="flex justify-between items-start mb-10 text-base">
          <div>
            <p>Nomor<span className="inline-block w-8 text-right">:</span> 01/PAN-QRB/2026</p>
            <p>Lamp.<span className="inline-block w-8 text-right">:</span> -</p>
            <p>Hal<span className="inline-block w-12 text-right">:</span> <strong className="underline">Undangan Menyaksikan Qurban</strong></p>
          </div>
        </div>

        {/* Tujuan */}
        <div className="mb-10 text-base leading-relaxed">
          <p>Kepada Yth.</p>
          <p className="font-bold text-lg">{namaPenerima}</p>
          <p>di Tempat.</p>
        </div>

        {/* Isi Surat */}
        <div className="text-base leading-relaxed text-justify">
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
                  <td className="w-32 py-1">Hari, Tanggal</td>
                  <td className="w-4">:</td>
                  <td className="font-bold">{tanggal}</td>
                </tr>
                <tr>
                  <td className="py-1">Waktu</td>
                  <td>:</td>
                  <td className="font-bold">07.30 WIB - Selesai</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Tempat</td>
                  <td className="align-top">:</td>
                  <td className="font-bold leading-tight">Area IPAL Windan RT 02 / RW 06 <br/> Gumpang, Kartasura</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-6">
            Kehadiran Bapak/Ibu sangat kami harapkan untuk menyaksikan kesempurnaan ibadah qurban ini. Semoga amal ibadah qurban Bapak/Ibu diterima oleh Allah SWT dan dicatat sebagai amal saleh. Amin Ya Rabbal 'Alamin.
          </p>

          <p className="mb-8 font-bold">Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
        </div>

        {/* Tanda Tangan - Format 2 Kolom Sejajar */}
        <div className="mt-8 text-base">
          <div className="text-right mb-4">
            <p>Kartasura, ........................ 2026</p>
          </div>
          
          <div className="flex justify-between text-center mt-2">
            <div className="w-1/2">
              <p className="mb-20">Ketua Takmir</p>
              <p className="font-bold underline">Abdurrahman Fidaulhaq Alhazmiy</p>
            </div>
            <div className="w-1/2">
              <p className="mb-20">Ketua Panitia Qurban</p>
              <p className="font-bold underline">Alfi Suryani Yusuf</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}