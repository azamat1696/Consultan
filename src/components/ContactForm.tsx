"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

interface ContactFormProps {
    onBack: () => void
    onSubmit: (formData: any) => void
    selectedDate: string
    selectedTime: string
    price: number
}

export default function ContactForm({
                                        onBack,
                                        onSubmit,
                                        selectedDate,
                                        selectedTime,
                                        price
                                    }: ContactFormProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        notes: "",
        acceptTerms: false
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
                <h3 className="font-medium mb-4">Ücretsiz Ön Görüşme</h3>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
            <span className="text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
                        {selectedDate}
                    </div>
                    <div className="flex items-center gap-2">
            <span className="text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
                        {selectedTime}
                    </div>
                    <div className="flex items-center gap-2">
            <span className="text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
                        {price === 0 ? "Ücretsiz" : `${price} ₺`}
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex items-center gap-2">
                        <Input
                            className="flex-1"
                            placeholder="Kupon"
                        />
                        <button className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                            Uygula
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        * Kayıtlı müşteriler kupon kullanabilir, hemen{" "}
                        <Link href="/kayit" className="text-blue-500 hover:underline">
                            kayıt olun
                        </Link>
                        .
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg p-6">
                <h3 className="font-medium mb-4">İletişim Bilgileri</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Adınız</label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Soyadınız</label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Telefon Numarası</label>
                        <div className="flex">
                            <select className="px-3 py-2 border rounded-l bg-gray-50">
                                <option value="+90">🇹🇷 +90</option>
                            </select>
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="rounded-l-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">E-mail</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Danışmana Not</label>
                        <Textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Siparişinizle İlgili Notlar (İsteğe Bağlı)"
                            className="resize-none"
                        />
                        <div className="text-right text-sm text-gray-500">
                            0 / 250
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Checkbox
                            id="terms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, acceptTerms: checked as boolean })
                            }
                            required
                        />
                        <label htmlFor="terms" className="text-sm">
                            <Link href="/on-bilgilendirme" className="text-red-500 hover:underline">
                                Ön Bilgilendirme Koşulları
                            </Link>
                            {"'"}nı ve{" "}
                            <Link href="/mesafeli-satis" className="text-red-500 hover:underline">
                                Mesafeli Satış Sözleşmesi
                            </Link>
                            {"'"}ni okudum, onaylıyorum.
                        </label>
                    </div>
                </form>
            </div>

            <div className="md:col-span-2 flex justify-between">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800"
                >
                    ← Önceki Sayfa
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Devam Et
                </button>
            </div>
        </div>
    )
}
