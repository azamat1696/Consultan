import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { appointmentSchema } from '@/lib/validations/schemas'
import { fromZodError } from 'zod-validation-error'

// GET all appointments
export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                consultant: true,
                client: true,
                packet: true,
            },
        })
        return NextResponse.json(appointments)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 })
    }
}

// POST new appointment
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate request body
        const validationResult = appointmentSchema.safeParse(body)
        if (!validationResult.success) {
            const errorMessage = fromZodError(validationResult.error)
            return NextResponse.json({ error: errorMessage.message }, { status: 400 })
        }

        const appointment = await prisma.appointment.create({
            data: {
                ...validationResult.data,
                dateTime: new Date(validationResult.data.dateTime),
            },
            include: {
                consultant: true,
                client: true,
                packet: true,
            },
        })
        return NextResponse.json(appointment, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 })
    }
}
