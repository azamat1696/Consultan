"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import FilterSection from "./FilterSection"
import Link from "next/link"

interface ConsultantCardProps {
    name: string
    surname: string
    title: string
    slug: string
    specialties: string[]
    image: string
    isOnline?: boolean
    packets?: any[]
    workspaces?: any[]
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price);
};

const ConsultantCard = ({
                            name,
                            surname,
                            title,
                            specialties,
                            image,
                            isOnline,
                            slug,
                            packets,
                            workspaces }: ConsultantCardProps) => {
                                

    const getUniqueWorkspaces = (workspaces: any[]) => {
        const seen = new Set();
        return workspaces.flat().filter(workspace => {
            const duplicate = seen.has(workspace.name);
            seen.add(workspace.name);
            return !duplicate;
        });
    };
    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative mx-auto md:mx-0">
                    <Image
                        src={image || '/assets/images/default-avatar.png'}
                        alt={`${name} ${surname}`}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                    />
                    {isOnline && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full" />
                    )}
                </div>
                <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg">{name} {surname}</h3>
                                <p className="text-sm text-gray-600">{title}</p>
                            </div>
                            <div className="flex items-center gap-1">
                            {/*
                                <span className="text-yellow-400">★</span>
                                <span className="text-yellow-400">★</span>
                                <span className="text-yellow-400">★</span>
                                <span className="text-yellow-400">★</span>
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm">{rating}</span>
                                <span className="text-sm text-gray-500">({reviewCount})</span>
                            */}
                            </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {specialties.slice(0, 3).map((specialty, index) => (
                                <span
                                    key={index}
                                    className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                                >
                                    {specialty}
                                </span>
                            ))}
                            {specialties.length > 3 && (
                                <span className="bg-red-50 text-red-500 px-3 py-1 text-sm rounded-full">
                                    +{specialties.length - 3} daha
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                        {getUniqueWorkspaces(workspaces || [])
                                                .slice(0, 3)
                                                .map((workspace: any, i: number) => (
                                                    <span 
                                                        key={`${workspace.name}-${i}`}
                                                        className="bg-gray-50 text-gray-700 px-3 py-1 text-sm rounded-full"
                                                    >
                                                        {workspace.name}
                                                    </span>
                                                ))}
                                            {(workspaces?.flat().length || 0) > 3 && (
                                                <span className="bg-red-50 text-red-500 px-3 py-1 text-sm rounded-full">
                                                    +{(workspaces?.flat().length || 0) - 3} daha
                                                </span>
                                            )}
                        </div>

                        <div className='w-full flex flex-col sm:flex-row justify-around items-center gap-2 mb-2 mt-4'>
                            {/* Free Consultation Badge */}
                            {packets?.find((packet: any) => packet.packet_type === "FREE") && (
                                <div className="flex items-center gap-1 text-green-600 text-sm bg-green-50 rounded-lg p-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span className='text-sm'>Ücretsiz Ön Görüşme</span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="text-center">
                                {packets && packets.length > 0 && (() => {
                                    const packet = packets.find((p:any) => 
                                        p.packet_type === "PACKAGE" && p.meeting_times === 1
                                    );
                                    return packet && (
                                        <div className='flex items-center flex-col justify-center'>
                                            <span className="line-through text-xs font-semibold text-gray-400">
                                                {formatPrice(packet.discounted_price)} TL
                                            </span>
                                            <p className="text-lg font-bold text-green-600">
                                                {formatPrice(packet.price)} TL
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 w-full md:w-auto flex flex-col md:flex-col items-center justify-center md:justify-end gap-2">
                        <div className="flex gap-2 w-full md:w-auto">
                            {isOnline && (
                                <Link 
                                    href={`/danisman/${slug}`}
                                    className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium text-center">
                                    Hemen Görüş
                                </Link>
                            )}
                            <Link 
                                href={`/danisman/${slug}`}
                                className="flex-1 md:flex-none bg-[#2D4D77] hover:bg-[#1e3557] text-white py-2 px-4 rounded-lg text-sm font-medium text-center">
                                Randevu Al
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface ConsultantSectionProps {
    consultants: any[];
}

export default function ConsultantSectionForSearch({ consultants }: ConsultantSectionProps) {
    return (
        <section className="py-8">
            <div className="container mx-auto">
              {/**
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
               */}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <FilterSection/>  
                    </div>
                                <div className="md:col-span-3">
                                <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold mb-4">Danışmanlarımız</h2>
                                        <p className="text-sm text-gray-500">
                                            {consultants.length} danışman bulundu
                                        </p>
                                </div>
                                    <div className="flex flex-col gap-4">
                                        {consultants.length > 0 ? consultants.map((consultant, index) => (
                                            <ConsultantCard key={index} {...consultant} />
                                        )) :
                                        (
                                            <div className="flex items-center justify-center min-h-[400px]">
                                                <p>Arama sonuçları bulunamadı</p>
                                            </div>
                                                                                )
                                    
                                    }
                                    </div>
                                </div>
                </div>
            </div>
        </section>
    )
}
