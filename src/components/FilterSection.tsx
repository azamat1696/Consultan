"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

export default function FilterSection() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Initialize state from URL parameters
    const [priceRange, setPriceRange] = useState({ 
        min: Number(searchParams.get('minPrice')) || 100, 
        max: Number(searchParams.get('maxPrice')) || 10000 
    })
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        searchParams.get('languages') ? searchParams.get('languages')!.split(',') : []
    )
    const [gender, setGender] = useState<string>(searchParams.get('gender') || '')

    // Apply filters by updating URL
    const applyFilters = () => {
        const params = new URLSearchParams()
        
        // Add current search query if exists
        const query = searchParams.get('query')
        if (query) params.set('query', query)
        
        // Add price range
        params.set('minPrice', priceRange.min.toString())
        params.set('maxPrice', priceRange.max.toString())
        
        // Add languages
        if (selectedLanguages.length > 0) {
            params.set('languages', selectedLanguages.join(','))
        }
        
        // Add gender
        if (gender) {
            params.set('gender', gender)
        }
        
        // Update URL
        router.push(`?${params.toString()}`)
    }

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
                <label className="text-sm font-medium mb-2 block">Cinsiyet</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={gender === 'female'}
                            onChange={() => setGender('female')}
                            className="rounded"
                        />
                        <span className="text-sm">Kadın</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={gender === 'male'}
                            onChange={() => setGender('male')}
                            className="rounded"
                        />
                        <span className="text-sm">Erkek</span>
                    </label>
                    {gender && (
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value=""
                                checked={gender === ''}
                                onChange={() => setGender('')}
                                className="rounded"
                            />
                            <span className="text-sm">Hepsi</span>
                        </label>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Dil</label>
                <div className="space-y-2">
                    {[
                        { label: "Türkçe" },
                        { label: "İngilizce" },
                        { label: "Almanca" },
                        { label: "Rusça" },
                        { label: "Arapça"}
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
                        </label>
                    ))}
                </div>
            </div>

            <Button className="w-full" onClick={applyFilters}>Uygula</Button>
        </div>
    )
}
