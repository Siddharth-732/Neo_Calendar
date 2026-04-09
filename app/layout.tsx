import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neo Calendar | Anime Editions",
  description: "A premium, interactive anime-themed calendar experience.",
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
