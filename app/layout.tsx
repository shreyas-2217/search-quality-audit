import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bypassing the Ad Machine — Search Quality Pilot Audit",
  description:
    "Live companion tool: compare vanilla search vs evasion (+ reddit) search, scored with a binary authenticity rubric.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-[#111111] antialiased">{children}</body>
    </html>
  );
}
