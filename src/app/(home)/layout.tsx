import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "./globals.css";
import Provider from "@/providers/Provider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Dancomy: Online Psikolog, Aile Danışmanı, Pedagog ve Diyetisyen",
    description: "Dancomy: Online Psikolog, Aile Danışmanı, Pedagog, Astrolog, Diyetisyen",
    keywords: "online psikolog, online aile danışmanı, online pedagog, online astrolog, online diyetisyen",
    applicationName: "Dancomy",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Provider>
         <div className="flex flex-col min-h-screen">
                <Navbar/>
                  {children}
                <Footer/>   
                <Toaster position="top-right" />
         </div>
       </Provider>
      </body>
    </html>
  );
}
