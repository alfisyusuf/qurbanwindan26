"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Daftar halaman yang boleh diakses tanpa login
    const publicPaths = ["/login", "/rekap"];

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const isPublicPath = publicPaths.includes(pathname);

      // Jika belum login dan BUKAN di halaman publik, lempar ke /login
      if (!session && !isPublicPath) {
        router.push("/login");
      } 
      // Jika sudah login tapi akses /login, lempar ke home
      else if (session && pathname === "/login") {
        router.push("/");
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isPublicPath = publicPaths.includes(pathname);
      if (!session && !isPublicPath) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return <>{children}</>;
}