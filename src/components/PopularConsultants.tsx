"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination} from "swiper/modules";
import { useEffect, useState } from 'react';
import { getPopularConsultants } from '@/app/action';

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
    }[];
}

export default function PopularConsultants() {
    const [consultants, setConsultants] = useState<Consultant[]>([]);

    useEffect(() => {
        getPopularConsultants().then(setConsultants).catch(console.error);
    }, []);
    return (
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
                    {consultants.map((consultant:any, index:any)  => (
                        <SwiperSlide key={index} className="pb-9 w-full max-w-[350px] min-w-[320px]">
                            <div className="bg-white rounded-2xl shadow-md p-6 w-80 flex flex-col items-center">
                                {/* Image and Online Status */}
                                <div className="relative mb-2">
                                    <img
                                        className="rounded-lg w-36 h-36 object-cover"
                                        src={consultant?.profile_image}
                                        alt={consultant?.name}
                                    />
                                    <span
                                        className="absolute -bottom-2 right-9 bg-green-100 text-green-600 px-3 py-1 text-xs rounded-full">
                                        Çevrim İçi
                                    </span>
                                </div>

                                {/* Consultant Info */}
                                <h3 className="text-lg font-semibold mt-2">{consultant.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{consultant.title}</p>

                                {/* Rating */}
                                {/*   <div className="flex items-center gap-1 mb-3">
                                   <div className="text-yellow-400">{'★'.repeat(consultant.rating)}</div>
                                    <span className="text-gray-500">({consultant.reviews})</span>
                                </div> */}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 justify-center mb-4">
                                    {consultant?.tags?.map((tag:any, i:number) => (
                                        <span key={i}
                                              className="bg-gray-50 text-gray-700 px-3 py-1 text-sm rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                    {consultant.moreTags > 0 && (
                                        <span className="bg-red-50 text-red-500 px-3 py-1 text-sm rounded-full">
                                            +{consultant.moreTags} daha
                                        </span>
                                    )}
                                </div>
                               {JSON.stringify(consultant)} 

                                {/* Free Consultation Badge */}
                                <div className="flex items-center gap-1 text-green-600 text-sm mb-4">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span>Ücretsiz Ön Görüşme</span>
                                </div>

                                {/* Price */}
                                <div className="text-center mb-4">
                                    <p className="line-through text-sm text-gray-400">{consultant.originalPrice}</p>
                                    <p className="text-lg font-bold text-green-600">{consultant.price}</p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2 w-full">
                                    <button
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                                        Hemen Görüş
                                    </button>
                                    <button
                                        className="flex-1 bg-[#2D4D77] hover:bg-[#1e3557] text-white py-2 px-4 rounded-lg text-sm font-medium">
                                        Randevu Al
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    );
}
