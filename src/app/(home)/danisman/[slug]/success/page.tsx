import { stripe } from '@/lib/stripe'
import { createAppointment } from '../randevu-al/actions'
import Link from 'next/link'

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: { session_id: string }
}) {
    const sessionId = searchParams.session_id

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === 'paid') {
        const appointmentData = JSON.parse(session.metadata?.appointmentData || '{}')
        await createAppointment(appointmentData)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Ödeme Başarılı!</h1>
            <p className="mb-4">Randevunuz başarıyla oluşturuldu.</p>
            <Link 
                href={`/danisman/${'dd'}`}
                className="text-blue-500 hover:underline"
            >
                Danışman profiline dön
            </Link>
        </div>
    )
} 