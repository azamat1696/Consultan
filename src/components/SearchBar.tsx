"use client"
import Link from "next/link";
import { useState } from "react";

interface Consultant {
    id: number;
    profile_image: string;
    title: string;
    name: string;
    surname: string;
    oldPrice: string;
    newPrice: string;
    slug: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Consultant[]>([]);

    const handleSearch = async (e: any) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        if (searchQuery) {
            try {
                const response = await fetch(`/api/consultants?query=${encodeURIComponent(searchQuery)}`);
                if (response.ok) {
                    const data: Consultant[] = await response.json();
                    setResults(data);
                } else {
                    console.error('Error fetching consultants:', response.statusText);
                    setResults([]);
                }
            } catch (error) {
                console.error('Error fetching consultants:', error);
                setResults([]);
            }
        } else {
            setResults([]);
        }
    };

    // Limit displayed results to 3
    const displayedResults = results.slice(0, 3);
    const totalResults = results.length;

    return (
        <div className="relative w-full justify-center">
            {/* Search Input */}
            <div className="flex items-center rounded-md px-4 py-2 bg-[#f1f3f5]">
                <input
                    type="text"
                    placeholder="Arama yapın..."
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
                            {displayedResults.map((result,index) => (
                                <Link
                                    key={index}
                                    href={`/danisman/${result.slug}`}
                                    className="flex items-center p-4 border-b hover:bg-gray-50"
                                    onClick={() => setQuery('')}
                                >
                                    <img
                                        src={result.profile_image}
                                        alt={result.name + " " + result.surname}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            {result.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">{result.name + " " + result.surname}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400 line-through">
                                            {result.oldPrice}
                                        </p>
                                        <p className="text-sm text-[#35303E] font-bold">
                                            {result.newPrice}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {totalResults > 3 && (
                                <div className="text-center p-3">
                                    <Link href={`/arama/${encodeURIComponent(query)}`} className="text-[#35303E] hover:underline" onClick={() => setQuery('')}>
                                        Tüm Sonuçları Gör ({totalResults})
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-4 text-gray-500">Sonuç bulunamadı.</div>
                    )}
                </div>
            )}
        </div>
    );
}
