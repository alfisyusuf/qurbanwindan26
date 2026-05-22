"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email atau Password salah!");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-black text-gray-800 mb-2 text-center">Login Panitia</h1>
        <p className="text-gray-500 text-center mb-8">Masuk untuk akses sistem qurban</p>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@qurban.com" required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••" required
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 active:scale-95 transition-transform">
            {loading ? "Memeriksa..." : "MASUK"}
          </button>
        </form>
      </div>
    </div>
  );
}