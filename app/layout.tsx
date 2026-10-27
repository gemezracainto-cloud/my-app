import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notes | Chill Neon Notes",
  description: "A dreamy neon-themed Next.js note application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
