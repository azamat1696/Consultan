"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import FilterSection from "./FilterSection"

interface ConsultantCardProps {
    name: string
    title: string
    specialties: string[]
    rating: number
    reviewCount: number
    price: number
    discountedPrice: number
    image: string
    isOnline?: boolean
    hasFreeConsultation?: boolean
}

const ConsultantCard = ({
                            name,
                            title,
                            specialties,
                            rating,
                            reviewCount,
                            price,
                            discountedPrice,
                            image,
                            isOnline,
                            hasFreeConsultation
                        }: ConsultantCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex gap-4">
                <div className="relative">
                    <Image
                        src={image}
                        alt={name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                    />
                    {isOnline && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">{name}</h3>
                            <p className="text-sm text-gray-600">{title}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-yellow-400">★</span>
                            <span className="text-yellow-400">★</span>
                            <span className="text-yellow-400">★</span>
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm">{rating}</span>
                            <span className="text-sm text-gray-500">({reviewCount})</span>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {specialties.map((specialty, index) => (
                            <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                            >
                {specialty}
              </span>
                        ))}
                    </div>

                    {hasFreeConsultation && (
                        <div className="mt-2 flex">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                Ücretsiz Ön Görüşme
              </span>
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            {price !== discountedPrice && (
                                <span className="text-sm line-through text-gray-400">
                  {price.toLocaleString('tr-TR')} TL
                </span>
                            )}
                            <span className="ml-2 text-lg font-semibold text-green-600">
                {discountedPrice.toLocaleString('tr-TR')} TL
              </span>
                        </div>
                        <div className="flex gap-2">
                            {isOnline && (
                                <Button variant="secondary">
                                    Hemen Görüş
                                </Button>
                            )}
                            <Button variant="default">
                                Randevu Al
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ConsultantSection() {
    const consultants = [
        {
            name: "Sedat Kaval",
            title: "Uzman Psikolojik Danışman (Çocuk-Ergen-Yetişkin Psikolojik Danışmanlığı)",
            specialties: ["Akran Zorbalığı", "Bağlanma Problemleri", "Dil ve konuşma bozuklukları"],
            rating: 5,
            reviewCount: 285,
            price: 2500,
            discountedPrice: 1750,
            image: "/assets/images/person1.jpeg",
            isOnline: true,
            hasFreeConsultation: true
        },
        {
            name: "Murat Abak",
            title: "Uzman Psikolojik Danışman (Çocuk, Ergen ve Yetişkinlere Yönelik Psikolojik Danışma Hizmeti)",
            specialties: ["Akran Zorbalığı", "Cinsel Kimlik", "Uyku Problemleri"],
            rating: 5,
            reviewCount: 242,
            price: 1750,
            discountedPrice: 1500,
            image: "/assets/images/person1.jpeg",
            hasFreeConsultation: true
        },
        {
            name: "Volkan Hoşkan",
            title: "Uzman Psikolog ve Terapist",
            specialties: ["Bağlanma Problemleri", "Cinsel Kimlik", "Tırnak Yeme"],
            rating: 5,
            reviewCount: 266,
            price: 3500,
            discountedPrice: 2500,
            image: "/assets/images/person1.jpeg",
            hasFreeConsultation: true
        }
    ]

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center gap-4 mb-8">
                    <div>
                        <Image src="/assets/images/aile-danismanligi.png" alt="" width={400} height={400}/>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold">Online Psikolog</h2>
                        <p className="text-gray-600 mt-2">
                            Online psikoloji danışmanlığı ile kişisel sorunlarınızı uzman psikologlarla çözün.
                            Anksiyete, depresyon ve stres yönetimi gibi konularda profesyonel destek alarak
                            daha sağlıklı bir yaşam sürün.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <FilterSection/>
                    </div>
                    <div className="md:col-span-3">
                        <div className="flex flex-col gap-4">
                            {consultants.map((consultant, index) => (
                                <ConsultantCard key={index} {...consultant} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
