"use client"

import Image from "next/image"
import { Star, Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import ReviewsSection from "@/components/ReviewsSection"
import { useParams } from "next/navigation"
import { getConsultant } from './actions'
import ReactMarkdown from 'react-markdown'
import Link from "next/link"

// Update the Consultant interface to match your database schema

interface Consultant {
    id: number
    name: string
    surname: string
    title: string
    profile_image: string
    slug: string
    description?: string
    packets: {
        packet_id: number
        packet_type: string
        meeting_times: number
        price: number
        discounted_price: number
        description?: string
    }[]
    consultantExpertiseLinks: {
        expertise: {
            id: number
            name: string
            slug: string
        }
    }[]
    workspaces: {
        id: number
        name: string
        slug: string
    }[]
    languages: {
        id: number
        name: string
    }[]
    meetingOptions: {
        id: number
        name: string
    }[]
    educations: {
        id: number
        university_name: string
        educational_degree: string
        department: string
        start_date: Date
        end_date: Date
        status: boolean
    }[]
    certificates: {
        id: number
        certificate_name: string
        issuing_organization: string
        given_date: Date
        status: boolean
    }[]
}

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
    const params = useParams()
    const [consultant, setConsultant] = useState<Consultant | null>(null)
    const [loading, setLoading] = useState(true)
    const [openService, setOpenService] = useState<number | null>(null)
    const [openSection, setOpenSection] = useState<string | null>(null)

    useEffect(() => {
        const fetchConsultant = async () => {
            try {
                const data = await getConsultant(params.slug as string)
                setConsultant(data)
            } catch (error) {
                console.error('Error fetching consultant:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.slug) {
            fetchConsultant()
        }
    }, [params.slug])
    console.log(consultant)
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    if (!consultant) {
        return <div className="flex justify-center items-center min-h-screen">Danışman bulunamadı</div>
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
    const getUniqueWorkspaces = (workspaces: any) => {
        const seen = new Set();
        return workspaces.flat().filter((workspace: any) => {
            const duplicate = seen.has(workspace.name);
            seen.add(workspace.name);
            return !duplicate;
        });
    };
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="w-full mx-auto py-4 grid grid-cols-1 md:grid-cols-3 gap-6 lg:container xl:container 2xl:container lg:px-[1rem]">
                {/* Left Column - Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="relative w-full aspect-square mb-4">
                            <Image
                                src={consultant.profile_image || '/assets/images/default-avatar.png'}
                                alt={`${consultant.name} ${consultant.surname}`}
                                fill
                                className="rounded-lg object-cover"
                            />
                        </div>
                        <div className="text-center">
                            <h1 className="text-lg font-semibold mb-1">{consultant.name} {consultant.surname}</h1>
                            <p className="text-sm text-gray-600 mb-2">{consultant.title}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Session Information (Accordion) */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm divide-y">
                        {consultant.packets.map((packet, index) => (
                            <div key={index} className="relative">
                                <button
                                    onClick={() => setOpenService(openService === index ? null : index)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <h2 className="font-medium">{packet.packet_type}</h2>
                                        {packet.meeting_times > 0 && (
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <Clock className="w-4 h-4 mr-1"/>
                                                {packet.meeting_times} görüşme
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {packet.packet_type !== "FREE" && (
                                            <>
                                                <span className="text-sm line-through text-gray-400">
                                                    {packet.discounted_price.toLocaleString('tr-TR')} TL
                                                </span>
                                                <span className="text-sm font-medium text-green-500">
                                                    {packet.price.toLocaleString('tr-TR')} TL
                                                </span>
                                            </>
                                        )}
                                        {packet.packet_type === "FREE" && (
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
                                        {packet.description && (
                                            <p className="text-sm text-gray-900 mb-4">
                                                {packet.description}
                                            </p>
                                        )}
                                        <div className="flex justify-center items-center">
                                            <Link href={`${params.slug}/randevu-al?packet_id=${packet.packet_id}`} className="bg-red-500 hover:bg-red-600 text-white px-10 rounded-xl block p-2">
                                                Randevu Al
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg shadow-sm mt-4">
                        {/* About */}
                        <AccordionItem
                            title="Hakkımda"
                            isOpen={openSection === 'about'}
                            onToggle={() => setOpenSection(openSection === 'about' ? null : 'about')}
                        >
                            <div className="text-sm text-gray-600 prose max-w-none">
                                <ReactMarkdown>
                                    {consultant.description || ''}
                                </ReactMarkdown>
                            </div>
                        </AccordionItem>
                        {/* Çalışma Alanları */}
                        <AccordionItem
                            title="ÇALIŞMA ALANLARIM"
                            isOpen={openSection === 'areas'}
                            onToggle={() => setOpenSection(openSection === 'areas' ? null : 'areas')}
                        >
                            <div className="space-y-2">
                                {consultant.consultantExpertiseLinks.map((link, index) => (
                                    <div key={index} className="flex items-center text-sm">
                                        <span className="text-red-500 mr-2">📍</span>
                                        {link.expertise.name}
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
                                       {
                                            getUniqueWorkspaces(consultant.workspaces).map((workspace: any, index: number) => (
                                                <div key={index} className="flex items-center text-sm">
                                                    <span className="text-red-500 mr-2">📍</span>
                                                    {workspace.name}
                                                </div>
                                            ))
                                       }
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            title="Hizmet Verdiği Diller"
                            isOpen={openSection === 'languages'}
                            onToggle={() => setOpenSection(openSection === 'languages' ? null : 'languages')}
                        >
                            <div className="space-y-2">
                                {consultant.languages.map((language, index) => (
                                    <div key={index} className="flex items-center text-sm">
                                        <span className="text-red-500 mr-2">📍</span>
                                        {language.name}
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            title="Eğitimlerim"
                            isOpen={openSection === 'educations'}
                            onToggle={() => setOpenSection(openSection === 'educations' ? null : 'educations')}
                        >
                            <div className="space-y-4">
                                {consultant.educations.map((education, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <h3 className="font-semibold text-base">
                                            {education.university_name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {education.educational_degree}, {education.department}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(education.start_date).getFullYear()} - 
                                            {education.end_date 
                                                ? new Date(education.end_date).getFullYear() 
                                                : 'Devam Ediyor'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            title="Sertifika/Kurslar"
                            isOpen={openSection === 'certificates'}
                            onToggle={() => setOpenSection(openSection === 'certificates' ? null : 'certificates')}
                        >
                            <div className="space-y-4">
                                {consultant.certificates.map((certificate, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <h3 className="font-semibold text-base">
                                            {certificate.certificate_name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {certificate.issuing_organization}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(certificate.given_date).getFullYear()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                   
                    </div>
                    {/* İncelemeler Bölümü 
                    <div className="md:col-span-2">
                        <ReviewsSection
                            reviews={reviews}
                            totalReviews={consultant.reviewCount || 0}
                        />
                    </div>*/}
                </div>
            </div>
        </div>
    )
}
