"use clients"

import { useState } from "react"
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { tr } from "date-fns/locale"
import ContactForm from "@/components/ContactForm"

interface TimeSlot {
    time: string
    available: boolean
}

export default function AppointmentPage() {
    const [step, setStep] = useState(1)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedService, setSelectedService] = useState<string | null>(null)

    const consultant = {
        name: "Sedat Kaval",
        title: "Uzman Psikolojik Danışman (Çocuk-Ergen-Yetişkin Psikolojik Danışmanlığı)",
        image: "/consultants/sedat-kaval.jpg",
        isOnline: true,
        services: [
            {
                name: "Ücretsiz Ön Görüşme",
                duration: "10 dk.",
                sessionCount: "(1 görüşme)",
                price: 0,
                isPreview: true
            },
            {
                name: "Tek Seans",
                duration: "45 dk.",
                sessionCount: "(1 görüşme)",
                originalPrice: 2500,
                price: 1750,
                tag: "Hemen görüşme seçeneği"
            },
            {
                name: "3 Seanslık Paket",
                duration: "45 dk.",
                sessionCount: "(3 görüşme)",
                originalPrice: 7500,
                price: 5000
            },
            {
                name: "5 Seanslık Paket",
                duration: "45 dk.",
                sessionCount: "(5 görüşme)",
                originalPrice: 10000,
                price: 8000
            },
            {
                name: "8 Seanslık Paket",
                duration: "45 dk.",
                sessionCount: "(8 görüşme)",
                originalPrice: 16000,
                price: 12000
            }
        ]
    }

    const timeSlots: TimeSlot[] = [
        { time: "11:00", available: true },
        { time: "12:00", available: true },
        { time: "13:00", available: true },
        { time: "14:00", available: true },
        { time: "15:00", available: false },
        { time: "16:00", available: true }
    ]

    const handleNextStep = () => {
        setStep(2)
    }

    const handlePreviousStep = () => {
        setStep(1)
    }

    const handleSubmit = (formData: any) => {
        console.log('Form submitted:', formData)
        // API çağrısı yapılacak
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            {/* Consultant Info */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                    <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-white">
                        <Image
                            src={consultant.image}
                            alt={consultant.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {consultant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div>
                    <h2 className="text-gray-600 text-sm">{consultant.title}</h2>
                    <h1 className="font-medium">{consultant.name}</h1>
                </div>
            </div>

            {step === 1 ? (
                <>
                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                        {consultant.services.map((service) => (
                            <div
                                key={service.name}
                                className={`rounded-lg border ${
                                    service.isPreview ? 'bg-red-50 border-red-100' : 'bg-white'
                                }`}
                            >
                                <label className="flex items-start p-4 cursor-pointer h-full">
                                    <input
                                        type="radio"
                                        name="service"
                                        checked={selectedService === service.name}
                                        onChange={() => setSelectedService(service.name)}
                                        className="mt-1 w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{service.name}</span>
                                            <div className="text-right">
                                                {service.originalPrice && (
                                                    <span className="text-gray-400 line-through mr-2">
                            {service.originalPrice} TL
                          </span>
                                                )}
                                                <span className="text-green-600">
                          {service.price === 0 ? 'Ücretsiz' : `${service.price} TL`}
                        </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {service.duration} • {service.sessionCount}
                                        </div>
                                        {service.tag && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                {service.tag}
                                             </span>
                                        )}
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Calendar */}
                        <div className="bg-white rounded-lg p-4">
                            <Calendar
                                mode="single"
                                selected={selectedDate || undefined}
                                onSelect={setSelectedDate as any}
                                locale={tr}
                                className="mx-auto"
                                disabled={{ before: new Date() }}
                            />
                        </div>

                        {/* Time Slots */}
                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-medium mb-4">Saat Seçin</h4>
                            <div className="space-y-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        disabled={!slot.available}
                                        onClick={() => setSelectedTime(slot.time)}
                                        className={`w-full p-3 rounded-lg border text-center transition-colors ${
                                            !slot.available
                                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                : selectedTime === slot.time
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'hover:border-green-200'
                                        }`}
                                    >
                                        {slot.time}
                                        {!slot.available && ' (Uygun Değil)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button className="text-gray-600 hover:text-gray-800">
                            ← Vazgeç
                        </button>
                        <button
                            onClick={handleNextStep}
                            disabled={!selectedDate || !selectedTime}
                            className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        >
                            Devam Et
                        </button>
                    </div>
                </>
            ) : (
                <ContactForm
                    onBack={handlePreviousStep}
                    onSubmit={handleSubmit}
                    selectedDate={selectedDate?.toLocaleDateString('tr-TR') || ''}
                    selectedTime={selectedTime || ''}
                    price={0} // Seçili servisin fiyatını geçin
                />
            )}
        </div>
    )
}
