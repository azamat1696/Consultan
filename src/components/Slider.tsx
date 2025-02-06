"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {Autoplay, Navigation, Pagination, Thumbs} from "swiper/modules";
import Image from "next/image";
import {useState, useEffect} from "react";
import { getActiveSliders } from "@/app/(home)/action";

interface Slider {
    id: number;
    title: string | null;
    description: string | null;
    image: string | null;
    mobileImage: string | null;
    status: boolean;
}

export default function Slider() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [sliders, setSliders] = useState<Slider[]>([]);

    useEffect(() => {
        getActiveSliders().then(setSliders).catch(console.error);
    }, []);

    return (
        <div className="bg-gray-50">
            <div className="hidden md:block h-[625px]">
                <Swiper
                    style={{
                        // @ts-ignore
                        '--swiper-navigation-color': '#111111',
                        '--swiper-pagination-color': '#070707',
                        '--swiper-navigation-size': '20px',
                    }}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{swiper: thumbsSwiper}}
                    pagination={{clickable: true}}
                    modules={[Navigation, Pagination, Thumbs, Autoplay]}
                    className="w-full h-full"
                    autoplay={{
                        delay: 4700,
                        disableOnInteraction: false,
                    }}
                >
                    {sliders.map((slider) => (
                        <SwiperSlide key={slider.id}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={slider.image || "/assets/images/default-slider.jpg"}
                                    alt={slider.title || ""}
                                    fill
                                    className="object-cover w-full h-full"
                                    priority
                                    sizes="100vw"
                                    quality={100}
                                    loading="eager"
                                    unoptimized
                                    fetchPriority="high"
                                    placeholder="blur"
                                    blurDataURL={slider.image || "/assets/images/default-slider.jpg"}
                                />
                                {(slider.title || slider.description) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white text-center p-4 z-10">
                                        {slider.title && <h2 className="text-4xl font-bold mb-4">{slider.title}</h2>}
                                        {slider.description && <p className="text-xl">{slider.description}</p>}
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="md:hidden h-[700px]">
                <Swiper
                    style={{
                        // @ts-ignore
                        '--swiper-navigation-color': '#111111',
                        '--swiper-pagination-color': '#070707',
                        '--swiper-navigation-size': '20px',
                    }}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{swiper: thumbsSwiper}}
                    pagination={{clickable: true}}
                    modules={[Navigation, Pagination, Thumbs, Autoplay]}
                    className="w-full h-full"
                    autoplay={{
                        delay: 4700,
                        disableOnInteraction: false,
                    }}
                >
                    {sliders.map((slider) => (
                        <SwiperSlide key={slider.id}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={slider.mobileImage || slider.image || "/assets/images/default-slider.jpg"}
                                    alt={slider.title || ""}
                                    fill
                                    className="object-cover w-full h-full"
                                    priority
                                    sizes="100vw"
                                    quality={100}
                                    loading="eager"
                                    unoptimized
                                    fetchPriority="high"
                                    placeholder="blur"
                                    blurDataURL={slider.mobileImage || slider.image || "/assets/images/default-slider.jpg"}
                                />
                                {(slider.title || slider.description) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-4">
                                        {slider.title && <h2 className="text-4xl font-bold mb-4">{slider.title}</h2>}
                                        {slider.description && <p className="text-xl">{slider.description}</p>}
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
