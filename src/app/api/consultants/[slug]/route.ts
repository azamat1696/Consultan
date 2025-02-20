import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const consultant = await prisma.consultant.findUnique({
            where: {
                slug: params.slug
            },
            include: {
                packets: true,
                specialties: true,
                workspaces: true,
                // Include other related data as needed
            }
        })

        if (!consultant) {
            return new NextResponse('Consultant not found', { status: 404 })
        }

        return NextResponse.json(consultant)
    } catch (error) {
        console.error('Error fetching consultant:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 