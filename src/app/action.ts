"use server"
import prisma from "@/lib/db";

export async function getPopularConsultants() {
    try {
        const consultants = await prisma.user.findMany({
            where: {
                role: 'consultant',
                status: true
            },
            select: {
                id: true,
                name: true,
                surname: true,
                title: true,
                profile_image: true,
                description: true,
                expertKnowledges: {
                    select: {
                       expert_knowledge_id: true
                    }
                },
                packets: {
                    where: { status: true },
                    orderBy: { price: 'asc' },
                    take: 5,
                    select: {
                        price: true,
                        discounted_price: true
                    }
                },
                consultantExpertiseLinks: {
                    select: {
                        expertise_id: true,
                        expertise: {
                            select: {
                                name: true
                            }
                            
                        },
                        workspaces: true

                    }

                }
            },
            take: 4
        });

        const formattedConsultants = consultants.map(consultant => ({
            ...consultant,
            packets: consultant.packets.map(packet => ({
                ...packet,
                price: packet.price.toString(),
                discounted_price: packet.discounted_price.toString()
            }))
        }));

        return formattedConsultants;
    } catch (error) {
        console.error('Error fetching popular consultants:', error);
        throw error;
    }
}

export async function getPopularCategories() {
    try {
        const categories = await prisma.expertise.findMany({
            select: {
                expertise_id: true,
                name: true,
                image: true
            },
            take: 6
        });
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
} 