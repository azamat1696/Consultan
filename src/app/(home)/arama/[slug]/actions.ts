"use server"
import prisma from "@/lib/db";
import { Workspace } from '../../../(admin-panel)/admin/users/[id]/types';

interface SearchFilters {
  keyword: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  languages?: string[];
}

export async function getSearchResults(filters: SearchFilters) {
  try {
    const { keyword, minPrice, maxPrice, gender, languages } = filters;
    
    // Build the where clause
    const whereClause: any = {
      status: true,
      deletedAt: null,
      role: "consultant",
      ...(keyword ? {
        OR: [
          { name: { contains: keyword } },
          { surname: { contains: keyword } },
          { title: { contains: keyword } },
          {
            consultantExpertiseLinks: {
              some: {
                expertise: {
                  name: { contains: keyword }
                }
              }
            }
          }
        ]
      } : {})
    };
    
    // Add gender filter if specified
    if (gender) {
      whereClause.gender = gender;
    }
    
    // Search for consultants based on filters
    const consultants = await prisma.user.findMany({
      where: whereClause,
      include: {
        consultantExpertiseLinks: {
          include: {
            expertise: true
          }
        },
        packets: {
          where: {
            status: true,
            deletedAt: null,
            ...(minPrice || maxPrice ? {
              OR: [
                {
                  price: {
                    ...(minPrice !== undefined && { gte: minPrice }),
                    ...(maxPrice !== undefined && { lte: maxPrice })
                  }
                },
                {
                  discounted_price: {
                    ...(minPrice !== undefined && { gte: minPrice }),
                    ...(maxPrice !== undefined && { lte: maxPrice })
                  }
                }
              ]
            } : {})
          }
        },
        languages: true // Include languages relation
      }
    });
    
    // Filter consultants by languages if specified
    let filteredConsultants = consultants;
    if (languages && languages.length > 0) {
      filteredConsultants = consultants.filter(consultant => {
        // Check if consultant has languages
        if (!consultant.languages || !Array.isArray(consultant.languages)) {
          return false;
        }
        
        // Check if any of the consultant's languages match the filter
        return languages.some(lang => 
          consultant.languages.some((cl: any) => 
            cl.name && cl.name.toLowerCase() === lang.toLowerCase()
          )
        );
      });
    }
    
    // Filter consultants by price if specified
    if (minPrice || maxPrice) {
      filteredConsultants = filteredConsultants.filter(consultant => 
        consultant.packets.length > 0
      );
    }
    
    return {
      keyword,
      filters: { minPrice, maxPrice, gender, languages },
      consultants: filteredConsultants.map(consultant => ({
        id: consultant.id,
        name: consultant.name,
        surname: consultant.surname,
        slug: consultant.slug,
        title: consultant.title,
        image: consultant.profile_image,
        specialties: consultant.consultantExpertiseLinks.map(link => link.expertise.name),
        workspaces: consultant.consultantExpertiseLinks.map(link => 
          link.workspaces ? JSON.parse(link.workspaces as string) : []
        ).flat(),
        packets: consultant.packets.map(packet => ({
          ...packet,
          price: Number(packet.price),
          discounted_price: Number(packet.discounted_price)
        })) || []
      }))
    }; 
   
  } catch (error) {
    console.error('Error searching consultants:', error);
    throw error;
  }
} 