import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "./AuthGuard";

export const metadata: Metadata = {
  title: "Qurban Scanner",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}