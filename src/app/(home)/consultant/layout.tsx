
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Provider from "@/providers/Provider";
import { Toaster } from "react-hot-toast";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
      <Provider>
             <Navbar/>
            {children}
            <Footer />
            <Toaster position="top-right" />
       </Provider>
      </body>
    </html>
  );
}
