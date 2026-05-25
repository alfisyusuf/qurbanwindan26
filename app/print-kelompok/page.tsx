"use client";

import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

// Data Kelompok Sapi
const dataSapi = [
  {
    kelompok: "KELOMPOK I",
    anggota: [
      "Kel. Bp Margono Amat Mukri",
      "Kel. Bp Sumanto, S. Kar",
      "Kel. Bp Frans Lasno Mastopo",
      "Kel. Bp Suparjo",
      "Kel. Bp Joko Prasetyo",
      "Kel. Bp Satimin - Bu Puji",
      "Kel. Ibu Maryati Warso Sukarto - Warsono"
    ]
  },
  {
    kelompok: "KELOMPOK II",
    anggota: [
      "Kel. Bp Alfi Suryani Yusuf",
      "Kel. Bp Sumanto",
      "Kel. Ibu Eko Narkunti",
      "Kel. Bp Achmad Djaelani Bin Adelar",
      "Kel. Bp Adi Saputro",
      "Kel. Bp Bambang Gunawan",
      "Kel. Bp Joko Pramono"
    ]
  },
  {
    kelompok: "KELOMPOK III",
    anggota: [
      "Kel. Bp Ilham",
      "Kel. Bp Sukirno",
      "Kel. Bp Yayang",
      "Kel. Bp Slamet Mulyono",
      "Kel. Bp Eko Setiawan",
      "Kel. Ibu Yanik (Meong Cell)",
      "Kel. Bp Dadiyo"
    ]
  }
];

// Data Kambing
const dataKambing = [
  "Bp Taufik",
  "Bp Sugi Cipto Suwarno"
];

export default function PrintKelompokPage() {
  return (
    <div className="min-h-screen bg-gray-200 pb-12 print:bg-white print:pb-0">
      
      {/* CSS KHUSUS PRINT */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            /* Margin diperkecil jadi 5mm agar ruang kertas lebih maksimal */
            margin: 5mm; 
          }
          body {
            -webkit-print-color-adjust: exact;
            background-color: white !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
            /* Mencegah browser memotong elemen di tengah-tengah */
            break-inside: avoid; 
          }
          .page-break:last-child {
            page-break-after: avoid;
            break-after: auto;
          }
        }
      `}</style>

      {/* CONTROL PANEL (HILANG SAAT PRINT) */}
      <div className="print:hidden bg-white shadow-xl mb-8 border-b border-gray-200 p-6 max-w-5xl mx-auto rounded-b-3xl flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-3 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="font-black text-2xl text-gray-800">Cetak Label Kelompok</h1>
            <p className="text-gray-500 text-sm">Sapi 1 halaman/kelompok, Kambing 1 halaman/orang.</p>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
        >
          <Printer size={24} /> CETAK A4
        </button>
      </div>

      {/* AREA KERTAS PRINT A4 */}
      <div className="print:w-full print:m-0 w-full max-w-[210mm] mx-auto flex flex-col gap-8 print:gap-0 font-sans">
        
        {/* LOOPING SAPI */}
        {dataSapi.map((sapi, index) => (
          <div key={`sapi-${index}`} className="page-break bg-white shadow-2xl print:shadow-none p-8 print:p-6 flex flex-col justify-center w-full min-h-[297mm] print:min-h-0 print:h-[285mm] border-8 border-black box-border">
            
            {/* Jarak Margin Header Diperkecil */}
            <div className="text-center mb-8 border-b-8 border-black pb-6">
              <h1 className="text-6xl font-black uppercase tracking-widest text-black">
                SAPI
              </h1>
              <h2 className="text-5xl font-bold mt-3 text-black bg-gray-200 inline-block px-8 py-2 rounded-2xl">
                {sapi.kelompok}
              </h2>
            </div>

            {/* Font Diperkecil sedikit (36px), Line-height dirapatkan, spacing dikurangi */}
            <ol className="list-decimal list-inside text-[36px] leading-tight font-bold text-black space-y-4 px-2">
              {sapi.anggota.map((nama, idx) => (
                <li key={idx} className="border-b-2 border-dashed border-gray-300 pb-2">
                  {nama}
                </li>
              ))}
            </ol>
            
          </div>
        ))}

        {/* LOOPING KAMBING */}
        {dataKambing.map((kambing, index) => (
          <div key={`kambing-${index}`} className="page-break bg-white shadow-2xl print:shadow-none p-10 print:p-8 flex flex-col items-center justify-center text-center w-full min-h-[297mm] print:min-h-0 print:h-[285mm] border-8 border-black box-border">
            
            <div className="w-full border-b-8 border-black pb-12 mb-12">
              <h1 className="text-[90px] font-black uppercase tracking-widest text-black leading-none">
                KAMBING
              </h1>
            </div>

            <h2 className="text-6xl font-black text-black leading-tight px-4 uppercase bg-gray-200 py-6 rounded-3xl w-full">
              {kambing}
            </h2>
            
          </div>
        ))}

      </div>

    </div>
  );
}