"use client"

import Image from "next/image"
import { Star, Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ReviewsSection from "@/components/ReviewsSection";
const AccordionItem = ({
                           title,
                           children,
                           isOpen,
                           onToggle
                       }: {
    title: string,
    children: React.ReactNode,
    isOpen: boolean,
    onToggle: () => void
}) => (
    <div className="bg-white rounded-lg shadow-sm mb-4">
        <button
            onClick={onToggle}
            className="w-full p-4 flex justify-between items-center"
        >
            <h2 className="font-medium">{title}</h2>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
            }`} />
        </button>
        {isOpen && (
            <div className="p-4 border-t">
                {children}
            </div>
        )}
    </div>
)
export default function ConsultantProfilePage() {
    const [openService, setOpenService] = useState<number | null>(null)
    const [openSection, setOpenSection] = useState<string | null>(null)
    const consultant = {
        name: "Volkan Hoşkan",
        title: "Uzman Psikolog ve Terapist",
        image: "/assets/images/person2.jpeg",
        rating: 5,
        reviewCount: 266,
        services: [
            {
                name: "Ön Görüşme",
                duration: "10 dk.",
                sessionCount: "1 görüşme",
                price: 0,
                isPreview: true,
                description: "* Randevu planlamasını yapabilmek,Seans Detaylarını Öğrenmek ve Benimle Tanışmak için,10 Dakika Ücretsiz WhatsApp,Skype veya Zoom üzerinden Sesli Görüşme olarak gerçekleşmektedir."
            },
            {
                name: "60 dk. Tek Seans",
                duration: "60 dk.",
                sessionCount: "1 görüşme",
                price: 3500,
                discountedPrice: 2500
            },
            {
                name: "5+1 Küçük Paket (4 Ay)",
                duration: "60 dk.",
                sessionCount: "6 görüşme",
                price: 15000,
                discountedPrice: 12500
            },
            {
                name: "10+3 Orta Paket (6 Ay)",
                duration: "60 dk.",
                sessionCount: "13 görüşme",
                price: 32500,
                discountedPrice: 25000
            },
            {
                name: "20+7 Büyük Paket (9 Ay)",
                duration: "60 dk.",
                sessionCount: "27 görüşme",
                price: 67500,
                discountedPrice: 50000
            }
        ],
        about: `5.2.1981 Yılında İzmir'de doğdum.Çocukluğum Ailemin işi sebebiyle Eskişehirde geçti.Bozüyük Anadolu Lisesi mezuniyetimden sonra 2005 yılında Kıbrıs'ta Tam burslu olarak Yakın Doğu Ünivetsitesi (İngilizce) Psikoloji Lisans bölümünden Psikolog Ünvanımı alarak Yüksek Onur Derecesiyle mezun oldum.Ege Üniversitesi Çocuk Psikiyatri Ana bilim dalı başkanı Sn.Prof.Dr.Cahide Aydın'ın yanında staj yaptım. Daha sonra Doğu Akdeniz Üniversitesinde Gelişim Master'ı eğitimi aldım.Birçok Psikoloji ve kişisel gelişim kongrelerine katıldım.Süpervizyon sürecimde,Sn.Prof.Dr.Psikiyatrist Murad Atmaca'dan Bat ve Emdr Terapi Teknikleri Eğitimi alarak,Psikoterapi Yetkinlik Sertifikamı aldım.Ayrıca İstanbul Kent Üniversitesinden E-Devlet onaylı, Çözüm Odaklı Terapi,Aile Danışmanlığı,Çift Terapisi,Cinsel Terapi ve Aile Dizimi Uygulayıcı Sertifikalarına sahibim.Son olarak Kariyerime, International Dublin Üniversitesinde Klinik Master Yüksek Lisans(Tezli) eğitimimi tamamlayarak Uzman Klinik Psikolog ünvanını ekledim.`,
        expertise: {
            areas: [
                "Bireysel Terapi",
                "Aile Danışmanlığı",
                "İlişki ve Çift Terapisi",
                "Çocuk ve Ergen Terapisi",
                "Cinsel Terapi"
            ],
            methods: [
                "Pozitif Psikoterapi",
                "Çözüm Odaklı Terapi",
                "Bilişsel Davranışçı Terapi",
                "Bütüncül Psikoterapi",
                "EMDR Terapi",
                "Aile Dizimi"
            ]
        },
        languages: ["Türkçe", "İngilizce"],
        platforms: ["Skype", "Microsoft Teams", "Whatsapp", "Zoom", "Google Meet"]
    }
    const reviews = [
        {
            id: 1,
            author: "Ayşe Eser",
            date: "16 Aralık 2024",
            rating: 5,
            comment: "Bu gün Volkan beyle ilk seansımızı yaptık. Ön görüşmede de kendisinin dalında uzman, mesleğini severek yaptığını gözlemledim. Güler yüzü, nazik davranışları, dinleme ve konuşma tavırları bende sonsuz bir güven teşkil etti. Volkan beyle olumlu ve başarılı sonuçlar elde edeceğime inanıyorum."
        },
        {
            id: 2,
            author: "Eren Yıldız",
            date: "14 Kasım 2024",
            rating: 5,
            comment: "Volkan Beyle 2. seansımızı bitirdik. Enerji akışı çok güzel. İnsan kendisini rahatlıkla ifade edebiliyor. Çok memnunum."
        },
        {
            id: 3,
            author: "İrem Çınar",
            date: "12 Ekim 2024",
            rating: 5,
            comment: "Volkan beyle ilk seansımızı gerçekleştirdik. Kendisinden pozitif bir enerji aldım ve çok güvenli ve rahat bir ortam yarattı."
        }
    ]
    return (
        <div className="bg-gray-100">
            <div className="w-full mx-auto py-4 grid grid-cols-1 md:grid-cols-3 gap-6 lg:container xl:container 2xl:container lg:px-[1rem]">
                {/* Sol Kolon - Profil Kartı */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="relative w-full aspect-square mb-4">
                                <Image
                                    src={consultant.image}
                                    alt={consultant.name}
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                            <div className="text-center">
                                <h1 className="text-lg font-semibold mb-1">{consultant.name}</h1>
                                <p className="text-sm text-gray-600 mb-2">{consultant.title}</p>
                                <div className="flex justify-center items-center gap-1 mb-3">
                                    {Array(5).fill(0).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current"/>
                                    ))}
                                    <span className="text-sm text-gray-500">({consultant.reviewCount})</span>
                                </div>
                                <Button variant="outline" size="sm" className="text-xs text-red-500">
                                    Blog Yazıları (1)
                                </Button>
                            </div>
                    </div>
                </div>

                {/* Sağ Kolon - Seans Bilgileri (Accordion) */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm divide-y">
                        {consultant.services.map((service, index) => (
                            <div key={index} className="relative">
                                <button
                                    onClick={() => setOpenService(openService === index ? null : index)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <h2 className="font-medium">{service.name}</h2>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Clock className="w-4 h-4 mr-1"/>
                                            {service.duration}
                                            <span className="ml-2 text-gray-400">({service.sessionCount})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {!service.isPreview && (
                                            <>
                      <span className="text-sm line-through text-gray-400">
                        {service.price?.toLocaleString('tr-TR')} TL
                      </span>
                                                <span className="text-sm font-medium text-green-500">
                        {service.discountedPrice?.toLocaleString('tr-TR')} TL
                      </span>
                                            </>
                                        )}
                                        {service.isPreview && (
                                            <span className="text-sm font-medium text-green-500">Ücretsiz</span>
                                        )}
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transition-transform ${
                                                openService === index ? 'transform rotate-180' : ''
                                            }`}
                                        />
                                    </div>
                                </button>

                                {openService === index && (
                                    <div className="p-4 bg-gray-50">
                                        {service.isPreview ? (
                                            <div className="space-y-4">
                                                <p className="text-sm text-gray-900">
                                                    {service.description}
                                                </p>
                                               <div className="flex justify-center items-center">
                                                   <Button className="bg-red-500 hover:bg-red-600 text-white px-10 rounded-xl">
                                                       Randevu Al
                                                   </Button>
                                               </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center">
                                                <Button className="bg-red-500 hover:bg-red-600 text-white px-10 rounded-xl">
                                                    Randevu Al
                                                </Button>
                                            </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                    </div>
                    <div className="bg-white rounded-lg shadow-sm mt-4">
                        {/* Hakkımda */}
                        <AccordionItem
                            title="Hakkımda"
                            isOpen={openSection === 'about'}
                            onToggle={() => setOpenSection(openSection === 'about' ? null : 'about')}
                        >
                            <p className="text-sm text-gray-600 whitespace-pre-line">
                                {consultant.about}
                            </p>
                        </AccordionItem>
                        {/* Çalışma Alanları */}
                        <AccordionItem
                            title="ÇALIŞMA ALANLARIM"
                            isOpen={openSection === 'areas'}
                            onToggle={() => setOpenSection(openSection === 'areas' ? null : 'areas')}
                        >
                            <div className="space-y-2">
                                {consultant.expertise.areas.map((area, index) => (
                                    <div key={index} className="flex items-center text-sm">
                                        <span className="text-red-500 mr-2">📍</span>
                                        {area}
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>

                        {/* Çalışma Ekolleri */}
                        <AccordionItem
                            title="ÇALIŞMA EKOLLERİM"
                            isOpen={openSection === 'methods'}
                            onToggle={() => setOpenSection(openSection === 'methods' ? null : 'methods')}
                        >
                            <div className="space-y-2">
                                {consultant.expertise.methods.map((method, index) => (
                                    <div key={index} className="flex items-center text-sm">
                                        <span className="text-red-500 mr-2">📍</span>
                                        {method}
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>

                        {/* Hizmet ve Görüşme Bilgileri */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h2 className="font-medium mb-3">Hizmet Verdiği Diller</h2>
                                <ul className="space-y-2">
                                    {consultant.languages.map((language, index) => (
                                        <li key={index} className="text-sm">• {language}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h2 className="font-medium mb-3">Görüşme Seçenekleri</h2>
                                <ul className="space-y-2">
                                    {consultant.platforms.map((platform, index) => (
                                        <li key={index} className="text-sm">• {platform}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* LinkedIn Butonu */}
                        <div className="flex justify-center mb-4">
                            <Button variant="outline" size="sm" className="text-sm">
                                <Image
                                    src="/images/linkedin.png"
                                    alt="LinkedIn"
                                    width={20}
                                    height={20}
                                    className="mr-2"
                                />
                                Profilimi ziyaret edin
                            </Button>
                        </div>

                        {/* Diğer Accordion Başlıkları */}
                        {['Çalışma Alanlarım', 'Eğitimlerim', 'Sertifika/Kurslar', 'İade Koşulları'].map((title) => (
                            <div key={title} className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <button className="w-full flex justify-between items-center">
                                    <span className="font-medium">{title}</span>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        ))}

                    </div>
                    {/* İncelemeler Bölümü */}
                    <div className="md:col-span-2">
                        <ReviewsSection
                            reviews={reviews}
                            totalReviews={266}
                        />
                    </div>
                </div>
            </div>


        </div>
    )
}
