'use server'

import prisma from '@/lib/db'

// Helper function to serialize data
const serializeConsultant = (consultant: any) => {
    return {
        ...consultant,
        workspaces: consultant.consultantExpertiseLinks
                .map((item: any) => item.workspaces ? JSON.parse(item.workspaces as string) : [])
                .filter((workspace: any) => workspace.length > 0),
        packets: consultant.packets.map((packet: any) => ({
            ...packet,
            price: Number(packet.price),
            discounted_price: Number(packet.discounted_price)
        }))
    }
}

export async function getConsultant(slug: string) {
    try {
        const consultant = await prisma.user.findUnique({
            where: {
                slug: slug,
                status: true,
                deletedAt: null,
                role: 'consultant'
            },
            include: {
                packets: {
                    where: {
                        status: true,
                        deletedAt: null
                    },
                    orderBy: [
                        { packet_type: 'desc' }, // FREE packets first
                        { meeting_times: 'asc' }  // Then by meeting times
                    ],
                    take: 5
                },
                consultantExpertiseLinks: {
                    include: {
                        expertise: true,
                    }
                },
                languages: true,
                meetingOptions: true,
                educations: true,
                certificates: true,
            }
        })

        if (!consultant) {
            throw new Error('Consultant not found')
        }

        // Serialize the data before returning
        return serializeConsultant(consultant)
    } catch (error) {
        console.error('Error fetching consultant:', error)
        throw error
    }
} 