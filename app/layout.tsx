import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DiTz Qur'an",
  description: "Full-stack Qur'an app dengan audio, tafsir, sholat, kiblat, AI, bookmark, dan 30 juz.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
