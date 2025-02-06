"use server"
import prisma from "@/lib/db";

interface GetLogsParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export async function getLogs({ page = 1, perPage = 10, search = "" }: GetLogsParams = {}) {
  try {
    const skip = (page - 1) * perPage;
    
    const where = {
      OR: search ? [
        { action: { contains: search } },
        { description: { contains: search } },
        { user: { name: { contains: search } } }
      ] : undefined
    };

    const [data, total] = await Promise.all([
      prisma.log.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.log.count({ where })
    ]);

    return {
      data,
      total,
      totalPages: Math.ceil(total / perPage)
    };
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
} 