import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrandSphere AI | Content Calendar Hub",
  description: "AI-Powered Digital Marketing & Content Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <nav className="bg-indigo-900 shadow-md border-b border-indigo-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <span className="font-bold text-xl text-white tracking-tight">BrandSphere AI</span>
                <div className="hidden md:flex space-x-4">
                  <a href="http://localhost:3001" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md font-medium transition">1. LocaSync</a>
                  <a href="http://localhost:3002" className="bg-indigo-800 text-white px-3 py-2 rounded-md font-medium shadow-inner">2. BrandSphere AI</a>
                  <a href="http://localhost:3003" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md font-medium transition">3. SupportShield AI</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow flex">
          {children}
        </main>
      </body>
    </html>
  );
}
