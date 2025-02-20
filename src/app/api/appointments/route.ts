import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
    try {
        const data = await req.json()
        
        const appointment = await prisma.appointment.create({
            data: {
                consultant_id: data.consultant_id,
                packet_id: data.packet_id,
                appointment_date: new Date(data.appointment_date),
                appointment_time: data.appointment_time,
                client_name: data.client_name,
                client_email: data.client_email,
                client_phone: data.client_phone,
                notes: data.notes,
                status: 'pending'
            }
        })

        return NextResponse.json(appointment)
    } catch (error) {
        console.error('Error creating appointment:', error)
        return NextResponse.json(
            { error: 'Failed to create appointment' },
            { status: 500 }
        )
    }
} 