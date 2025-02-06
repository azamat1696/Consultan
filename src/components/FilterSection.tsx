"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function FilterSection() {
    const [priceRange, setPriceRange] = useState({ min: 100, max: 10000 })
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-4">Filtreler</h3>

            <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Fiyat Aralığı</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-24 p-2 border rounded"
                        min={0}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-24 p-2 border rounded"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Dil</label>
                <div className="space-y-2">
                    {[
                        { label: "Türkçe", count: 436 },
                        { label: "İngilizce", count: 40 },
                        { label: "Almanca", count: 5 },
                        { label: "Rusça", count: 2 },
                        { label: "Arapça", count: 1 }
                    ].map((language) => (
                        <label key={language.label} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedLanguages.includes(language.label)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedLanguages([...selectedLanguages, language.label])
                                    } else {
                                        setSelectedLanguages(selectedLanguages.filter(l => l !== language.label))
                                    }
                                }}
                                className="rounded"
                            />
                            <span className="text-sm">{language.label}</span>
                            <span className="text-sm text-gray-500">({language.count})</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button className="w-full">Uygula</Button>
        </div>
    )
}
