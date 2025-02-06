import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "./globals.css";
import Provider from "@/providers/Provider";
import { Toaster } from "react-hot-toast";
import AdminHeader from '@/components/admin/Header';
import AdminFooter from '@/components/admin/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Provider>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <AdminHeader />
                <main className="flex-1 container mx-auto px-4 py-8">
                    {children}
                </main>
                <AdminFooter />
            </div>
            <Toaster position="top-right" />
       </Provider>
      </body>
    </html>
  );
}
