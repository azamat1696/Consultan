import { Geist, Geist_Mono } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "@/app/(home)/globals.css";
import Provider from "@/providers/Provider";
import { Toaster } from "react-hot-toast";
import AdminHeader from "@/components/admin/Header";
import AdminFooter from "@/components/admin/Footer";
import { Metadata } from "next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin Panel",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 min-h-screen flex flex-col`}
        cz-shortcut-listen="true"
      >
      <Provider>
           <AdminHeader/>
           <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow  ">
              {children}
           </main>
            <AdminFooter/>   
            <Toaster position="top-right" />
       </Provider>
      </body>
    </html>
  );
}
