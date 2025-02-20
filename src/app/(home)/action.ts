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
                slug: true,
                expertKnowledges: {
                    select: {
                       expert_knowledge_id: true
                    }
                },
                packets: {
                    where: { status: true },
                    orderBy: [
                        { packet_type: 'asc' },
                        { price: 'asc' }
                    ],
                    take: 5,
                    select: {
                        price: true,
                        discounted_price: true,
                        packet_type: true,
                        packet_title: true,
                        meeting_times: true
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
                },
                weeklyCalendars: true
            },
            take: 4
        });

        const formattedConsultants = consultants.map(consultant => ({
            ...consultant,
            packets: consultant.packets.map(packet => ({
                ...packet,
                price: packet.price.toString(),
                discounted_price: packet.discounted_price.toString()
            })),
            consultantExpertiseLinks: consultant.consultantExpertiseLinks.map(link => link.expertise.name),
            workspaces: consultant.consultantExpertiseLinks
                .map(item => item.workspaces ? JSON.parse(item.workspaces as string) : [])
                .filter(workspace => workspace.length > 0),
            // show all workspaces total count
            workspacesTotal: consultant.consultantExpertiseLinks.map(item => 
                item.workspaces ? JSON.parse(item.workspaces as string).length : 0
            ),
        }));

        return formattedConsultants;
    } catch (error) {
        console.error('Error fetching popular consultants:', error);
        throw error;
    }
}

export async function getPopularCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export async function getActiveSliders() {
  try {
    return await prisma.slider.findMany({
      where: {
        status: true,
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return [];
  }
}

export async function getMenus() {
    try {
        const menus = await prisma.menu.findMany({
            where: {
                deletedAt: null,
                parentId: null // Get only parent menus
            },
            include: {
                children: {
                    where: { deletedAt: null },
                    include: {
                        category: true,
                        parent: true
                    }
                },
                category: true,
                parent: true
            },
            orderBy: {
                order_number: 'asc'
            }
        });
        return menus;
    } catch (error) {
        console.error('Error fetching menus:', error);
        return [];
    }
} 