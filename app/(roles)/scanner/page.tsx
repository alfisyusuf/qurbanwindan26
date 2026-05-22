"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle2, XCircle, AlertCircle, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

type KuponData = {
  id: string;
  kode_unik: string;
  nama_penerima: string | null;
  kategori: string;
  jatah_plastik: number;
  status_claim: boolean;
};

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<KuponData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (scanner.isScanning) {
              scanner.pause();
              setIsScanning(false);
              await fetchKuponData(decodedText);
            }
          },
          (err) => { /* ignore continous scan errors */ }
        );
      } catch (err) {
        console.error("Gagal akses kamera", err);
        setErrorMsg("Gagal mengakses kamera. Pastikan izin diberikan.");
      }
    };

    startScanner();

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  const fetchKuponData = async (kodeUnik: string) => {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from("kupon")
      .select("*")
      .eq("kode_unik", kodeUnik)
      .single();

    if (error || !data) {
      setErrorMsg("Kupon tidak valid / tidak ada di database!");
    } else if (data.status_claim) {
      setErrorMsg(`Kupon ini SUDAH DIAMBIL!`);
    } else {
      setScannedData(data);
    }
    
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!scannedData) return;
    setLoading(true);

    const { error } = await supabase
      .from("kupon")
      .update({ status_claim: true, waktu_claim: new Date().toISOString() })
      .eq("id", scannedData.id);

    setLoading(false);

    if (error) {
      setErrorMsg("Gagal update data. Coba lagi.");
    } else {
      alert("✅ Sukses Serahkan Daging!");
      resetScanner();
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setErrorMsg(null);
    setIsScanning(true);
    
    // Gunakan try-catch agar tidak error jika state tidak sesuai
    try {
      if (scannerRef.current) {
        scannerRef.current.resume();
      }
    } catch (err) {
      console.log("Meresume kamera...", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between">
        <h1 className="text-white font-bold tracking-widest text-lg flex items-center gap-2">
          <Camera size={20} /> SCAN KUPON
        </h1>
        <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      </div>

      {/* Kamera Area */}
      <div id="reader" className="w-full max-w-md h-full object-cover rounded-none" />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      )}

      {/* Modal Error */}
      {errorMsg && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-red-500 text-white p-8 rounded-3xl text-center w-full max-w-sm shadow-2xl">
            <AlertCircle size={64} className="mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-2">DITOLAK!</h2>
            <p className="text-lg font-medium mb-8">{errorMsg}</p>
            <button 
              onClick={resetScanner}
              className="w-full bg-white text-red-600 py-4 rounded-xl font-bold text-xl active:scale-95 transition-transform"
            >
              Scan Ulang
            </button>
          </div>
        </div>
      )}

      {/* Modal Sukses (Glassmorphism) */}
      {scannedData && !errorMsg && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end p-4 bg-black/40 backdrop-blur-lg">
          <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/50">
            <div className="text-center mb-6">
              <CheckCircle2 size={56} className="mx-auto text-green-500 mb-2" />
              <p className="text-gray-500 font-medium uppercase tracking-widest text-sm mb-1">
                {scannedData.kode_unik}
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {scannedData.nama_penerima || "KUPON KOSONGAN"}
              </h2>
              
              <div className="bg-blue-50 py-4 rounded-2xl border-2 border-blue-200 border-dashed mb-2">
                <p className="text-blue-600 font-semibold mb-1 uppercase tracking-wide text-sm">Berikan Daging</p>
                <p className="text-6xl font-black text-blue-700">
                  {scannedData.jatah_plastik} <span className="text-3xl">Plastik</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirm}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-2xl shadow-lg shadow-green-500/30 active:scale-95 transition-all"
              >
                SELESAI & SERAHKAN
              </button>
              <button 
                onClick={resetScanner}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-lg active:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle size={20} /> Batal / Salah Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}