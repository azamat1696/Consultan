"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination} from "swiper/modules";
import { useEffect, useState } from 'react';
import { getPopularConsultants, getPopularCategories } from '@/app/(home)/action';
import Image from 'next/image';
import Link from 'next/link';

interface Consultant {
    id: number;
    name: string | null;
    surname: string | null;
    title: string | null;
    profile_image: string | null;
    description: string | null;
    expertKnowledges: any[];
    packets: {
        price: string;
        discounted_price: string;
        type: string;
        name: string;
        is_free_session: boolean;
        meeting_times: number;
    }[];
    workspaces: any[];
}

interface Category {
    id: bigint;
    title: string;
    page_path: string | null;
}

export default function PopularConsultants() {
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getPopularConsultants(),
            getPopularCategories()
        ]).then(([consultantsData, categoriesData]) => {
            setConsultants(consultantsData as any);
            setCategories(categoriesData as any);
            setIsLoading(false);
        }).catch(console.error);
    }, []);

    const getUniqueWorkspaces = (workspaces: any[]) => {
        const seen = new Set();
        return workspaces.flat().filter(workspace => {
            const duplicate = seen.has(workspace.name);
            seen.add(workspace.name);
            return !duplicate;
        });
    };
    const formatPrice = (price: number | string) => {
        // Convert string to number if needed and handle null/undefined
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        // Check if it's a valid number
        if (!numPrice || isNaN(numPrice)) return '0.00';
        
        return numPrice.toFixed(2);
    };
    console.log(consultants);
    return (
        !isLoading && (
        <div style={{backgroundImage: "url('/assets/images/Patterns.png')", backgroundColor: "#E9EFF9"}}
             className="py-10 w-full">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">Popüler Danışmanlar</h2>
            </div>

            <div className="lg:container xl:container 2xl:container w-full mx-auto lg:px-[1rem] xl:px-[10rem] 2xl:px-[10rem] px-4 ">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={20}
                    centeredSlides={true}
                    edgeSwipeDetection={true}
                    breakpoints={{
                        200: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        250: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        300: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        400: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination,Navigation]}
                    width={300}
                    className="mt-2 w-full relative"
                >
                    {consultants.map((consultant:any, index:number)  => (
                        <SwiperSlide key={consultant.id || index} className="pb-9 w-full max-w-[350px] min-w-[320px]">
                            <div className="bg-white rounded-2xl shadow-md p-6 w-80 flex flex-col items-center h-[470px] justify-between">
                                <div className='flex flex-col items-center'>
                                   {/* Image and Online Status */}
                                    <div className="relative mb-2">
                                        <Image
                                            width={144}
                                            height={144}
                                            className="rounded-lg w-36 h-36 object-cover"
                                            src={consultant?.profile_image || '/assets/images/default-avatar.png'}
                                            alt={consultant?.name || 'Consultant'}
                                            priority
                                        />
                                        {consultant.status && (
                                            <span className="absolute -bottom-2 right-9 bg-green-100 text-green-600 px-3 py-1 text-xs rounded-full">
                                                Çevrim İçi
                                            </span>
                                        )}
                                    </div>
                                    {/* Consultant Info */}
                                    <h3 className="text-lg font-semibold mt-2">{consultant.name +' '+ consultant.surname}</h3>
                                    <p className="text-gray-500 text-xs mb-2">{consultant.title}</p>

                                    {/* Rating */}
                                    {/* <div className="flex items-center gap-1 mb-3">
                                    <div className="text-yellow-400">{'★'.repeat(consultant.rating)}</div>
                                        <span className="text-gray-500">({consultant.reviews})</span>
                                    </div> */}

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        {getUniqueWorkspaces(consultant?.workspaces || [])
                                            .slice(0, 3)
                                            .map((workspace: any, i: number) => (
                                                <span 
                                                    key={`${workspace.name}-${i}`}
                                                    className="bg-gray-50 text-gray-700 px-3 py-1 text-sm rounded-full"
                                                >
                                                    {workspace.name}
                                                </span>
                                            ))}
                                        {(consultant?.workspaces?.flat().length || 0) > 3 && (
                                            <span className="bg-red-50 text-red-500 px-3 py-1 text-sm rounded-full">
                                                +{(consultant?.workspaces?.flat().length || 0) - 3} daha
                                            </span>
                                        )}
                                    </div>
                                

                                    <div className='w-full flex justify-around items-center gap-2 mb-2'>
                                            {/* Free Consultation Badge */}
                                            {consultant.packets.find((packet: any) => packet.packet_type === "FREE") && (
                                                <div className="flex items-center gap-1 text-green-600 text-sm bg-green-50 rounded-lg p-2">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                    <span className='text-sm'>Ücretsiz Ön Görüşme</span>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="text-center">
                                                {consultant.packets.length > 0 && (() => {
                                                    const packet = consultant.packets.find((p:any) => 
                                                        p.packet_type === "PACKAGE" && p.meeting_times === 1
                                                    );
                                                    return packet && (
                                                        <div key={index} className='flex items-center flex-col justify-center'>
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

                                {/* Buttons */}
                                <div className="flex justify-center gap-2 w-full">
                                    {
                                        consultant.packets.find((packet: any) => packet.packet_type === "FREE") && (
                                            <Link 
                                                href={`/danisman/${consultant?.slug}`}
                                                className="text-center flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                                                Hemen Görüş
                                            </Link>
                                        )
                                    }
                                    <Link
                                         href={`/danisman/${consultant?.slug}`}
                                        className="bg-[#2D4D77] hover:bg-[#1e3557] text-white py-2 px-4 rounded-lg text-sm font-medium text-center">
                                        Randevu Al
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
        )
    );
}

