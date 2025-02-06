"use client"

import Image from "next/image"

interface Step {
    id: number
    title: string
    description: string
    image: string
}

export default function HowItWorksSection() {
    const steps: Step[] = [
        {
            id: 1,
            title: "KİMLER DANIŞMAN OLABİLİR?",
            description: "Advicemy.com üzerinde hizmet veren tüm danışmanlar kendi alanlarında uzmanlaşmış profesyonellerdir. Size, deneyimden danışman olmak isteyen kişiler uzman Advicemy tarafından incelenecektir ve kriterleri sağladığı durumda https://advicemy",
            image: "/images/how-it-works/consultant.jpg"
        },
        {
            id: 2,
            title: "DANIŞMAN MESAJLARı",
            description: "Hizmet alacağınızın ilk kısımda çok küçük önemli şartları, danışanlar tarafından hizmet için ilk ilk yeri görme fırsatını değerdir. Danışanlarla en hızlı ve net şekilde cevap vermek durumundaki süreçleri yönetebilirsiniz",
            image: "/images/how-it-works/messages.jpg"
        },
        {
            id: 3,
            title: "ÖN GÖRÜŞME",
            description: "Uzmanlarla ücretsiz danışmanlık süreci nasıl işler bunu öğrenebilirsiniz. İlerleyen süreçte olabilecek tüm soruları ve merakları danışmanlarınızdan komplike modellerini dilediğiniz. Ön görüşme randevularınızda hemen meşgulüne ulaşabilirsiniz, randevu saatini belirleyebilirsiniz genel yetkin",
            image: "/images/how-it-works/consultation.jpg"
        },
        {
            id: 4,
            title: "RANDEVU",
            description: "Danışanlar size veya uygulama üzerinden direkt olarak danışman tarafından gün ve saat seçerek randevu oluşturabilir. Ücretsiz randevularınızı online olarak uygulama üzerinden direkt olarak danışman ile keyifli bir görüşme gerçekleştirebilirsiniz",
            image: "/images/how-it-works/appointment.jpg"
        },
        {
            id: 5,
            title: "GÖRÜŞME Ol",
            description: "Danışmanınız belirlenen saat veya yeni randevularınızı belirleyebilirsiniz. Bu durumda danışanlar tarafından saat ayarlaması yapıl ayarlanır veya yeni randevu oluşturulur. Danışanlar tarafından belirlenen saatte randevuyu başlatması gerek",
            image: "/images/how-it-works/meeting.jpg"
        },
        {
            id: 6,
            title: "PAKET SATIŞ",
            description: "Danışmanlar birden çok görüşme seçenekleri için paket seçeneği sunabilirler. Paket seçeneğinde nasıl olmasını istiyorsanız kısa süreyli paket satışı olması, paket satış sonrasında danışmanın ek veya uygulama üzerinden randevi yönetimini gerçekleştirdir",
            image: "/images/how-it-works/package.jpg"
        },
        {
            id: 7,
            title: "ÖDEME VE KOMİSYON",
            description: "Advicemy.com üzerinden, ödemeleriniz bir şirketli hafta sonrasında gün içinde danışmanlara gönderilmektedir. Advicemy üzerinde yürütülen tüm işlemler için %15 komisyon alınır. Komisyon tutarı fatura edilecektir",
            image: "/images/how-it-works/payment.jpg"
        }
    ]

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışıyor?</h2>

                <div className="relative">
                    {/* Bağlantı çizgisi */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

                    <div className="space-y-16">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex flex-col ${
                                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                } items-center gap-8 relative`}
                            >
                                {/* Görsel */}
                                <div className="w-full md:w-1/2 flex justify-center">
                                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* İçerik */}
                                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold text-red-500 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Bağlantı noktası */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
