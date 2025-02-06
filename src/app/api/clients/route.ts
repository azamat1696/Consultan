import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { clientSchema } from '@/lib/validations/schemas'
import { fromZodError } from 'zod-validation-error'

const prisma = new PrismaClient()

// GET all clients
export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            include: {
                appointments: true,
            },
        })
        return NextResponse.json(clients)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching clients' }, { status: 500 })
    }
}

// POST new clients
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate request body
        const validationResult = clientSchema.safeParse(body)
        if (!validationResult.success) {
            const errorMessage = fromZodError(validationResult.error)
            return NextResponse.json({ error: errorMessage.message }, { status: 400 })
        }

        const [client] = await Promise.all([prisma.client.create({
            // @ts-ignore
            data: validationResult.data,
        })])
        return NextResponse.json(client, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Error creating clients' }, { status: 500 })
    }
}
