"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { getPopularCategories } from "@/app/action";

interface Category {
    expertise_id: number;
    name: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default function PopularCategories() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getPopularCategories().then(setCategories).catch(console.error);
    }, []);

    return (
        <div className="py-10 lg:container xl:container 2xl:container w-full mx-auto px-4">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">Popüler Kategoriler</h2>
                <p className="text-gray-600 mt-2">
                    38 kategoride <strong className="text-black">800`den fazla</strong> uzman sizin için burada...
                </p>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.map((category) => (
                    <div key={category.expertise_id} className="bg-white rounded-xl drop-shadow px-5 py-5 flex flex-col items-center">
                        <Image
                            src="/assets/images/default-category.png"
                            alt={category.name || ""}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover max-w-40 max-h-40"
                        />
                        <h3 className="font-normal text-md pt-4">{category.name}</h3>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <button className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-red-600 transition duration-150">
                    Tüm Kategorileri Gör
                </button>
            </div>
        </div>
    );
}
