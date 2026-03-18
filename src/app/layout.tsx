import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "USCMA Learning",
  description: "USCMA Exam Preparation System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
