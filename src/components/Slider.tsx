"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {Autoplay, Navigation, Pagination, Thumbs} from "swiper/modules";
import Image from "next/image";
import {useState} from "react";

export default function Slider() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const sliderData = [
        {
            image: "/assets/images/slider1.jpg",
            title: "Uzman Psikolog",
            description: "Size uygun danışmanlar ile iletişim kurun.",
            width: 1800,
            height: 600,
        },
        {
            image: "/slider2.jpg",
            title: "Aile Danışmanı",
            description: "Aileniz için en iyi çözümleri bulun.",
            width: 1800,
            height: 600,
        },
        {
            image: "/slider3.jpg",
            title: "Astrolog",
            description: "Uzman astrologlardan profesyonel hizmet alın.",
            width: 1800,
            height: 600,
        },
    ];
    const mobileSliderData = [
        {
            image: "/assets/images/mobile-slider1.jpeg",
            title: "Uzman Psikolog",
            description: "Size uygun danışmanlar ile iletişim kurun.",
            width: 1200,
            height: 1350,
        },
        {
            image: "/slider2.jpg",
            title: "Aile Danışmanı",
            description: "Aileniz için en iyi çözümleri bulun.",
            width: 1200,
            height: 1350,
        },
        {
            image: "/slider3.jpg",
            title: "Astrolog",
            description: "Uzman astrologlardan profesyonel hizmet alın.",
            width: 1200,
            height: 1350,
        },
    ];
    return (
        <div className="bg-gray-50">
            <div className="hidden md:block">
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
                    className="mySwiper"
                    autoplay={{
                        delay: 4700,
                        disableOnInteraction: false,
                    }}
                >
                    {sliderData.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col items-center text-center">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    width={slide.width}
                                    height={slide.height}
                                    className="w-full object-cover rounded-lg"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="md:hidden">
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
                    className="mySwiper"
                    autoplay={{
                        delay: 4700,
                        disableOnInteraction: false,
                    }}
                >
                    {mobileSliderData.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col items-center text-center">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    objectFit={"cover"}
                                    width={slide.width}
                                    height={slide.height}
                                    className="w-full object-cover rounded-lg"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
