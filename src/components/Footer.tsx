"use client"
import Image from "next/image"
export default function Footer(){
    return (
        <div className="bg-gray-100">
            <footer className="bg-[#35303E] text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between items-start mb-8">
                        <div className="w-full text-center md:w-1/4 mb-6 md:mb-0">
                            <a href="#" className="flex justify-center items-center">
                                <Image src="/assets/icons/logo.png" alt="Dancomy Logo" width={150} height={150} /> 
                            </a>
                        </div>

                        <div className="w-full text-center md:w-2/4 grid grid-cols-1 gap-4 md:grid-cols-3 text-sm">
                           {/*  <div>
                                <h3 className="font-semibold mb-2">Menü</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:underline">Nasıl Çalışıyor?</a></li>
                                    <li><a href="#" className="hover:underline">Hakkımızda</a></li>
                                    <li><a href="#" className="hover:underline">İletişim</a></li>
                                    <li><a href="#" className="hover:underline">Blog</a></li>
                                </ul>
                            </div>*/}
                            <div>
                                <ul className="space-y-2">
                                    <li><a href="/kullanim-sartlari" className="hover:underline">Kullanım Şartları</a></li>
                                    <li><a href="/gizlilik-haklari-ve-kvkk" className="hover:underline">Gizlilik Hakları ve KVKK</a></li>
                                    <li><a href="/mesafeli-satis-sozlesmesi" className="hover:underline">Mesafeli Satış Sözleşmesi</a></li>
                                    <li><a href="/iade-sureci-cerez-politikasi" className="hover:underline">İade Süreci - Çerez Politikası</a></li>
                                </ul>
                            </div>
                        </div>

                      {/*   <div className="w-full md:w-1/4 text-center">
                            <h3 className="font-semibold mb-2">Bizi Takip Edin</h3>
                            <div className="flex space-x-4 mb-4 justify-center">
                                <a href="#" className="hover:opacity-80">
                                    <img src="facebook-icon.png" alt="Facebook"
                                         className="h-6"/>
                                </a>
                                <a href="#" className="hover:opacity-80">
                                    <img src="instagram-icon.png" alt="Instagram" className="h-6"/>
                                </a>
                                <a href="#" className="hover:opacity-80">
                                    <img src="linkedin-icon.png" alt="LinkedIn" className="h-6"/>
                                </a>
                            </div>
                            <div className="flex space-x-4 justify-center">
                                <a href="#" className="hover:opacity-80">
                                    <img src="google-play-badge.png" alt="Google Play" className="h-8"/>
                                </a>
                                <a href="#" className="hover:opacity-80">
                                    <img src="app-store-badge.png" alt="App Store" className="h-8"/>
                                </a>
                            </div>
                        </div>*/}
                    </div>

                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <div className="text-center text-sm text-gray-400">
                            © {new Date().getFullYear()} Dancomy. Tüm hakları saklıdır.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
