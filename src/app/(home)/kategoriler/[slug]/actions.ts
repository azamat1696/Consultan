"use server"
import prisma from "@/lib/db";
import { Workspace } from '../../../(admin-panel)/admin/users/[id]/types';

export async function getCategoryWithConsultants(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { 
        slug,
        deletedAt: null
      },
      include: {
        expertiseLinks: {
          include: {
            expertise: true
          }
        },
        categoryLinks: {
          include: {
            workspace: true
          }
        }
      }
    });

    if (!category) {
      throw new Error("Kategori bulunamadı");
    }

    const expertiseIds = category.expertiseLinks.map(link => link.expertiseId);
    const workspaceIds = category.categoryLinks.map(link => link.workspaceId);

    const consultants = await prisma.user.findMany({
      where: {
        status: true,
        deletedAt: null,
        role: "consultant",
        consultantExpertiseLinks: {
          some: {
            expertise_id: { in: expertiseIds }
          }
        }
      },
      include: {
        consultantExpertiseLinks: {
          include: {
            expertise:true
          }
        },
        packets: true
      }
    });
    
   return {
      category,
      consultants: consultants.map(consultant => ({
        id: consultant.id,
        name: consultant.name,
        surname: consultant.surname,
        slug: consultant.slug,
        title: consultant.title,
        image: consultant.profile_image,
        specialties: consultant.consultantExpertiseLinks.map(link => link.expertise.name),
        workspaces: consultant.consultantExpertiseLinks.map(link => JSON.parse(link.workspaces as string)) || [],
       // workspace2: consultant.consultantExpertiseLinks.map(link => JSON.parse(link.workspaces as string)).flat().filter(workspace => workspaceIds.includes(workspace.workspace_id)),
        packets: consultant.packets.map(packet => ({
          ...packet,
          price: Number(packet.price),
          discounted_price: Number(packet.discounted_price)
        })) || []
      }))
    }; 
   
  } catch (error) {
    console.error('Error fetching category and consultants:', error);
    throw error;
  }
} 