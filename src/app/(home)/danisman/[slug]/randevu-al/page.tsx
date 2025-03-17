"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { tr } from "date-fns/locale"
import ContactForm from "@/components/ContactForm"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { getConsultant } from "../actions"
import { createAppointment, getConsultantCalendar, createCheckoutSession } from "./actions"
import "react-day-picker/style.css"
import toast from "react-hot-toast"
import { loadStripe } from '@stripe/stripe-js'

interface TimeSlot {
    time: string
    available: boolean
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function AppointmentPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const packet_id = searchParams.get('packet_id')

    const [step, setStep] = useState(1)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [consultant, setConsultant] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedPacketId, setSelectedPacketId] = useState<number | null>(null)
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const router = useRouter()
    useEffect(() => {
        const fetchConsultant = async () => {
            try {
                const data = await getConsultant(params.slug as string)
                setConsultant(data)
                // Set the selected packet from URL params
                const urlPacketId = searchParams.get('packet_id')
                if (urlPacketId) {
                    setSelectedPacketId(Number(urlPacketId))
                }
            } catch (error) {
                console.error('Error fetching consultant:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.slug) {
            fetchConsultant()
        }
    }, [params.slug, searchParams])

    // Fetch available time slots when date is selected
    useEffect(() => {
        const fetchTimeSlots = async () => {
            if (selectedDate && consultant) {
                const result = await getConsultantCalendar(
                    consultant.id, 
                    selectedDate.toISOString()
                )
                console.log("result",result)
                if (result.success) {
                    console.log("result.data",result.data)
                    setTimeSlots(
                        result.data.map((time: string) => ({
                            time,
                            available: true
                        }))
                    )
                } else {
                    setTimeSlots([])
                }
            }
        }

        fetchTimeSlots()
    }, [selectedDate, consultant])
    console.log("timeSlots",timeSlots)

    const handleNextStep = () => {
        setStep(2)
    }

    const handlePreviousStep = () => {
        setStep(1)
    }

    const handleSubmit = async (formData: any) => {
        try {
            const appointmentData = {
                consultant_id: consultant.id,
                packet_id: selectedPacketId!,
                appointment_date: selectedDate!,
                appointment_time: selectedTime!,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                notes: formData.notes,
                amount: selectedPacket?.packet_type === 'FREE' ? 0 : selectedPacket?.price
            }

            console.log('Selected Packet:', selectedPacket);
            console.log('Appointment Data:', appointmentData);

            // Check if it's a paid appointment
            if (selectedPacket?.packet_type !== 'FREE' && selectedPacket?.price > 0) {
                console.log('Creating checkout session for paid appointment');
                const checkoutResult = await createCheckoutSession(appointmentData, selectedPacket)
                console.log('Checkout Result:', checkoutResult);
                
                if (!checkoutResult) {
                    throw new Error('Ödeme oturumu oluşturulamadı')
                }

                if (!checkoutResult.success) {
                    throw new Error(checkoutResult.error || 'Ödeme oturumu oluşturulamadı')
                }

                if (checkoutResult.skipPayment) {
                    toast.success('Randevu başarıyla oluşturuldu')
                    router.push(`/danisman/${params.slug}`)
                    return
                }

                if (!checkoutResult.url) {
                    throw new Error('Ödeme sayfası URL\'i oluşturulamadı')
                }

                // Redirect to Stripe checkout
                window.location.href = checkoutResult.url
            } else {
                console.log('Creating free appointment');
                // Free appointment - create directly
                const result = await createAppointment(appointmentData)

                if (!result.success) {
                    throw new Error(result.error || 'Randevu oluşturulamadı')
                }
                
                toast.success('Randevu başarıyla oluşturuldu')
                router.push(`/danisman/${params.slug}`)
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
        }
    }

    const selectedPacket = consultant?.packets.find((p:any) => p.packet_id === selectedPacketId)
    const isMultiSession = selectedPacket?.meeting_times > 1

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (!consultant) {
        return <div className="flex justify-center items-center h-screen">Consultant not found</div>
    }

    return (
        <div className="max-w-5xl mx-auto p-4 min-h-screen">
            {/* Consultant Info */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                    <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-white">
                        <Image
                            src={consultant.profile_image || '/assets/images/default-avatar.png'}
                            alt={`${consultant.name} ${consultant.surname}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div>
                    <h2 className="text-gray-600 text-sm">{consultant.title}</h2>
                    <h1 className="font-medium">{consultant.name} {consultant.surname}</h1>
                </div>
            </div>

            {step === 1 ? (
                <>
                    {/* Packets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-8">
                        {consultant.packets.map((packet: any) => (
                            <div
                                key={packet.packet_id}
                                className={`rounded-lg border ${
                                    packet.packet_type === "FREE" ? 'bg-red-50 border-red-100' : 'bg-white'
                                } ${
                                    selectedPacketId === packet.packet_id ? 'ring-2 ring-red-500' : ''
                                }`}
                            >
                                <label className="flex items-start p-4 cursor-pointer h-full">
                                    <input
                                        type="radio"
                                        name="packet"
                                        checked={selectedPacketId === packet.packet_id}
                                        onChange={() => setSelectedPacketId(packet.packet_id)}
                                        className="mt-1 w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{packet.packet_type}</span>
                                            <div className="text-right">
                                                {packet.discounted_price > 0 && (
                                                    <span className="text-gray-400 line-through mr-2">
                                                        {packet.discounted_price} TL
                                                    </span>
                                                )}
                                                <span className="text-green-600">
                                                    {packet.price === 0 ? 'Ücretsiz' : `${packet.price} TL`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {packet.meeting_times} görüşme
                                        </div>
                                        {packet.description && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                {packet.description}
                                            </p>
                                        )}
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Calendar */}
                        <div className={`bg-white rounded-lg p-4 relative ${isMultiSession ? 'opacity-50' : ''}`}>
                            {isMultiSession && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
                                    <p className="text-center text-gray-700 px-4">
                                        Bu paket için ilk görüşme sonrası diğer görüşme tarihleri belirlenecektir.
                                    </p>
                                </div>
                            )}
                            <Calendar
                                mode="single"
                                selected={selectedDate || undefined}
                                onSelect={(date: Date | undefined) => !isMultiSession && setSelectedDate(date || null)}
                                locale={tr}
                                disabled={{ before: new Date() }}
                                required={false}
                            />
                        </div>

                        {/* Time Slots */}
                        <div className={`bg-white rounded-lg p-4 relative ${isMultiSession ? 'opacity-50' : ''}`}>
                            {isMultiSession && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
                                    <p className="text-center text-gray-700 px-4">
                                        İlk görüşme sonrası diğer seansların saatleri belirlenecektir.
                                    </p>
                                </div>
                            )}
                            <h4 className="font-medium mb-4">Saat Seçin</h4>
                            {timeSlots.length > 0 ? (
                                <div className="space-y-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            disabled={!slot.available || isMultiSession}
                                            onClick={() => setSelectedTime(slot.time)}
                                            className={`w-full p-3 rounded-lg border text-center transition-colors ${
                                                !slot.available || isMultiSession
                                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                    : selectedTime === slot.time
                                                        ? 'border-green-500 bg-green-50 text-green-700'
                                                        : 'hover:border-green-200'
                                            }`}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {selectedDate 
                                        ? 'Bu tarih için müsait saat bulunmamaktadır.' 
                                        : 'Lütfen bir tarih seçin'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button 
                            onClick={() => window.history.back()}
                            className="text-gray-600 hover:text-gray-800">
                            ← Vazgeç
                        </button>
                        <button
                            onClick={handleNextStep}
                            disabled={!selectedPacketId || (!selectedDate && !isMultiSession) || (!selectedTime && !isMultiSession)}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500"
                        >
                            Devam Et
                        </button>
                    </div>
                </>
            ) : (
                <ContactForm
                    onBack={handlePreviousStep}
                    onSubmit={handleSubmit}
                    selectedDate={isMultiSession ? 'Görüşme sonrası belirlenecek' : selectedDate?.toLocaleDateString('tr-TR') || ''}
                    selectedTime={isMultiSession ? 'Görüşme sonrası belirlenecek' : selectedTime || ''}
                    price={selectedPacket?.price || 0}
                />
            )}
        </div>
    )
}
