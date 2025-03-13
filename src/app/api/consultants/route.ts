import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db'; // Adjust the import based on your setup

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = new URL(req?.url || '');
    const query = searchParams.get('query');

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Invalid query parameter' });
    }

    try {
        const consultants = await prisma.user.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { name: { contains: query } },
                    { surname: { contains: query } },
                    {
                        consultantExpertiseLinks: {
                            some: {
                                expertise: {
                                    name: { contains: query }
                                },
                                workspaces: { array_contains: query }

                            }
                        },

                    }
                ],
                status: true,
                role: "consultant"
            },
            select: {
                name:true,
                surname: true,
                profile_image: true,
                title: true,
                slug: true,
                consultantExpertiseLinks: {
                    include: {
                        expertise: true
                    }
                },
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
                }
            }
        });

        return Response.json(consultants);
    } catch (error) {
        console.error('Error fetching consultants:', error);
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}