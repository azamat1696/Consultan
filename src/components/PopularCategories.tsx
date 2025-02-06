"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { getPopularCategories } from "@/app/(home)/action";

interface Category {
    id: bigint;
    menuId: bigint;
    title: string;
    page_path: string | null;
    image: string | null;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function PopularCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [displayedCategories, setDisplayedCategories] = useState<Category[]>([]);

    useEffect(() => {
        getPopularCategories().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        setDisplayedCategories(showAll ? categories : categories.slice(0, 6));
    }, [categories, showAll]);

    const handleShowAll = () => {
        setShowAll(true);
    };

    return (
        <div className="py-10 lg:container xl:container 2xl:container w-full mx-auto px-4">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">Popüler Kategoriler</h2>
                <p className="text-gray-600 mt-2">
                    38 kategoride <strong className="text-black">800`den fazla</strong> uzman sizin için burada...
                </p>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {displayedCategories.map((category) => (
                    <div key={category.id.toString()} className="bg-white rounded-xl drop-shadow px-5 py-5 flex flex-col items-center">
                        <Image
                            src={category?.image || "/assets/images/default-category.jpg"}
                            alt={category.title || ""}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover max-w-40 max-h-40"
                        />
                        <h3 className="font-normal text-md pt-4">{category.title}</h3>
                    </div>
                ))}
            </div>

                 <div className="mt-8 flex justify-center">
                    <button 
                        className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-red-600 transition duration-150"
                        onClick={handleShowAll}
                    >
                        Tüm Kategorileri Gör
                    </button>
                </div>
        </div>
    );
}
