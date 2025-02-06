"use clients"

import { useState } from "react"
import Image from "next/image"

interface Step {
    id: number
    title: string
    description: string
    image: string
}

export default function HowItWorksPage() {
    const [activeTab, setActiveTab] = useState<'customer' | 'consultant'>('customer')

    const customerSteps: Step[] = [
        {
            id: 1,
            title: "DANIŞMANI BUL",
            description: "Advicemy üzerinde bir çok kategoride danışmanımız bulunmakta. Danışmanlar bölümünden kategorilerine göre danışmanları görebilir, detayları inceleyebilir, daha önceki görüşmelerin yorumlarını okuyabilirsiniz.",
            image: "/images/how-it-works/find-consultant.jpg"
        },
        {
            id: 2,
            title: "RANDEVUNU OLUŞTUR",
            description: "Her danışmanın kendine ait randevu defteri var, danışmanın sayfasından uygun günü ve saati seç",
            image: "/images/how-it-works/create-appointment.jpg"
        },
        {
            id: 3,
            title: "GÜVENLİ ÖDE",
            description: "Ödemeler randevu tarihine kadar Advicemy.com bünyesinde güvence altında tutulmaktadır. Randevunuzun gerçekleşmeme durumunda tüm ödeme müşteri kredi kartına iade edilir.",
            image: "/images/how-it-works/secure-payment.jpg"
        },
        {
            id: 4,
            title: "UZMANLA GÖRÜŞ",
            description: "Randevu aldıktan sonra bir işlem yapmanıza gerek yok, randevu gün ve saatinde danışman sana ulaşacak ve tercih ettiğiniz görüşme şeklinde görüşmenizi yapacaksınız.",
            image: "/images/how-it-works/meet-expert.jpg"
        }
    ]

    const consultantSteps: Step[] = [
        {
            id: 1,
            title: "KİMLER DANIŞMAN OLABİLİR?",
            description: "Advicemy.com üzerinde konusunda uzman kişiler danışmanlık yapabilirler. Size ulaşmadan danışman olmak isteyen kişiler uzman Advicemy tarafından incelenecektir ve kriterleri sağladığı durumda danışman olarak yayına alınacaktır.",
            image: "/images/how-it-works/who-can-be-consultant.jpg"
        },
        {
            id: 2,
            title: "DANIŞAN MESAJLARI",
            description: "Hizmet alacağınızın ilk kısımda çok küçük önemli şartları, danışanlar tarafından hizmet için ilk ilk yeri görme fırsatını değerdir. Danışanlarla en hızlı ve net şekilde cevap vermek durumundaki süreçleri yönetebilirsiniz.",
            image: "/images/how-it-works/clients-messages.jpg"
        },
        {
            id: 3,
            title: "ÖN GÖRÜŞME",
            description: "Müşteriler ücretsiz danışmanlık süreci nasıl işler bunu öğrenebilirsiniz. İlerleyen süreçte olabilecek tüm soruları ve merakları danışmanlarınızdan komplike modellerini dilediğiniz. Ön görüşme randevularınızda hemen meşgulüne ulaşabilirsiniz.",
            image: "/images/how-it-works/pre-meeting.jpg"
        },
        {
            id: 4,
            title: "RANDEVU",
            description: "Danışanlar size veya uygulama üzerinden direkt olarak danışman tarafından gün ve saat seçerek randevu oluşturabilir. Ücretsiz randevularınızı online olarak uygulama üzerinden direkt olarak danışman ile keyifli bir görüşme gerçekleştirebilirsiniz.",
            image: "/images/how-it-works/appointment.jpg"
        },
        {
            id: 5,
            title: "ÇEVRİMİÇİ OL",
            description: "Danışmanlar Advicemy.com veya uygulama üzerinden kendi tarifeyelerine kendi koşullarını ekleyebilir. Bu durumda danışanlar tarafından saat ayarlaması yapıl ayarlanır veya yeni randevu oluşturulur.",
            image: "/images/how-it-works/be-online.jpg"
        },
        {
            id: 6,
            title: "PAKET SATIŞ",
            description: "Danışmanlar birden çok görüşme seçenekleri için paket seçeneği sunabilirler. Paket seçeneğinde nasıl olmasını istiyorsanız kısa süreyli paket satışı olması, paket satış sonrasında danışmanın ek veya uygulama üzerinden randevi yönetimini gerçekleştirdir.",
            image: "/images/how-it-works/package-sale.jpg"
        },
        {
            id: 7,
            title: "ÖDEME VE KOMİSYON",
            description: "Advicemy.com üzerinden, ödemeleriniz bir şirketli hafta sonrasında gün içinde danışmanlara gönderilmektedir. Advicemy üzerinde yürütülen tüm işlemler için %20 komisyon alınır.",
            image: "/images/how-it-works/payment-commission.jpg"
        }
    ]

    const activeSteps = activeTab === 'customer' ? customerSteps : consultantSteps

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">Nasıl Çalışıyor?</h1>
                    <div className="flex justify-center gap-4 mb-12">
                        <button
                            onClick={() => setActiveTab('customer')}
                            className={`px-6 py-2 rounded-full transition-colors ${
                                activeTab === 'customer'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Müşteriyim
                        </button>
                        <button
                            onClick={() => setActiveTab('consultant')}
                            className={`px-6 py-2 rounded-full transition-colors ${
                                activeTab === 'consultant'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Danışmanım
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {activeSteps.map((step, index) => (
                        <div key={step.id} className="relative">
                            {/* Bağlantı çizgisi */}
                            {index < activeSteps.length - 1 && (
                                <div className="absolute left-[50%] top-[90%] w-px h-24 border-l-2 border-dashed border-gray-300" />
                            )}

                            <div className="flex flex-col md:flex-row items-center gap-8 mb-24">
                                <div className="w-full md:w-1/2">
                                    <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 text-center md:text-left">
                                    <h3 className="text-xl font-semibold text-red-500 mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
