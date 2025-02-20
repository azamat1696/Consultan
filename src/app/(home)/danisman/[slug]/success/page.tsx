import { stripe } from '@/lib/stripe'
import { createAppointment } from '../randevu-al/actions'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ödeme Başarılı',
    description: 'Randevunuz başarıyla oluşturuldu',
}

interface PageProps {
    params: { slug: string }
    searchParams: { [key: string]: string | undefined }
}
export default async function SuccessPage() {
    return (
        <div className="max-w-2xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Ödeme Başarılı!</h1>
            <p className="mb-4">Randevunuz başarıyla oluşturuldu.</p>
        </div>
    )
}

/*
export default async function SuccessPage({ searchParams }: PageProps) {
    const sessionId = searchParams.session_id
    if (!sessionId) return null

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const appointmentData = JSON.parse(session.metadata?.appointmentData || '{}')
    
    if (session.payment_status === 'paid') {
        await createAppointment(appointmentData)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Ödeme Başarılı!</h1>
            <p className="mb-4">Randevunuz başarıyla oluşturuldu.</p>
            <Link 
                href={`/danisman/${appointmentData.consultant_id || ''}`}
                className="text-blue-500 hover:underline"
            >
                Danışman profiline dön
            </Link>
        </div>
    )
} 
*/