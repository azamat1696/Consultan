"use client"
import { useState } from "react";

const mockData = [
    {
        id: 1,
        image: "/img1.jpg",
        title: "Uzman Psikolojik Danışman (Çocuk, Ergen ve Yetişkinlere Yönelik Psikolojik Danışma Hizmeti)",
        name: "Murat Abak",
        oldPrice: "1750 ₺",
        newPrice: "1500 ₺",
    },
    {
        id: 2,
        image: "/img2.jpg",
        title: "Uzman Psikolojik Danışman (Çocuk-Ergen-Yetişkin Psikolojik Danışmanlığı)",
        name: "Sedat Kaval",
        oldPrice: "2500 ₺",
        newPrice: "1750 ₺",
    },
    {
        id: 3,
        image: "/img3.jpg",
        title: "Uzman Psikolog ve Terapist",
        name: "Volkan Hoşkan",
        oldPrice: "3500 ₺",
        newPrice: "2500 ₺",
    },
];

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(mockData);

    const handleSearch = (e:any) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        if (searchQuery) {
            setResults(
                mockData.filter((item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setResults([]);
        }
    };

    return (
        <div className="relative w-full justify-center">
            {/* Search Input */}
            <div className="flex items-center rounded-md px-4 py-2 bg-[#f1f3f5]">
                <input
                    type="text"
                    placeholder="Danışmanlık Uzmanlık... Ara"
                    className="flex-1 outline-none text-gray-700 bg-[#f1f3f5]"
                    value={query}
                    onChange={handleSearch}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-[#35303E]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.9 14.32a8 8 0 111.414-1.414l4.3 4.3a1 1 0 01-1.415 1.415l-4.3-4.3zM8 14a6 6 0 100-12 6 6 0 000 12z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            {/* Dropdown Results */}
            {query && (
                <div className="absolute z-50 w-full bg-white border rounded-md shadow mt-2">
                    {results.length > 0 ? (
                        <>
                            {results.map((result) => (
                                <div
                                    key={result.id}
                                    className="flex items-center p-4 border-b hover:bg-gray-50"
                                >
                                    <img
                                        src={result.image}
                                        alt={result.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            {result.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">{result.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400 line-through">
                                            {result.oldPrice}
                                        </p>
                                        <p className="text-sm text-[#35303E] font-bold">
                                            {result.newPrice}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="text-center p-3">
                                <button className="text-[#35303E] hover:underline">
                                    Tüm Sonuçları Gör (982)
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-4 text-gray-500">Sonuç bulunamadı.</div>
                    )}
                </div>
            )}
        </div>
    );
}
