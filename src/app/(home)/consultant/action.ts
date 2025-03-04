"use server";
import prisma from "@/lib/db";
import {redirect} from "next/navigation";
import { getServerSession } from "next-auth";
import {authOptions} from "@/lib/auth";
import fs from 'fs/promises';
import path from 'path';
import { User } from './types';
import { Decimal } from '@prisma/client/runtime/library';
import { PacketType } from '@prisma/client';
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateSlug } from "@/lib/slug";
import { mkdir, writeFile } from 'fs/promises';

interface Expertise {
    expertise_id: number;
    name: string | null;
}

interface Workspace {
    workspace_id: number;
    name: string | null;
}

interface ConsultantExpertise {
    id: number;
    expertise_id: number;
    consultant_id: number;
    workspaces: Workspace[];
    expertise: Expertise;
}

interface MeetingOption {
    id: number;
    name: string;
}

interface Language {
    id: number;
    name: string;
}

interface SessionUser {
  user: {
    id: number;
    email?: string;
  }
}

const DAYS = [
    { id: 1, name: 'Pazartesi' },
    { id: 2, name: 'Salı' },
    { id: 3, name: 'Çarşamba' },
    { id: 4, name: 'Perşembe' },
    { id: 5, name: 'Cuma' },
    { id: 6, name: 'Cumartesi' },
    { id: 7, name: 'Pazar' },
];

export async function contactInfoRegister(formData: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    let imageUrl = undefined;
    
    // Handle image upload
    if (formData.image instanceof File) {
        try {
            // Create uploads directory if it doesn't exist
            const uploadsDir = '/var/www/uploads/consultants';
            await fs.mkdir(uploadsDir, { recursive: true });

            // Generate unique filename
            const fileName = `${session.user.id}-${Date.now()}${path.extname(formData.image.name)}`;
            const filePath = path.join(uploadsDir, fileName);

            // Convert File to Buffer and save
            const buffer = Buffer.from(await formData.image.arrayBuffer());
            await fs.writeFile(filePath, buffer);

            // Set the relative URL for database
            imageUrl = `/uploads/consultants/${fileName}`;
        } catch (error) {
            console.error('Error saving image:', error);
        }
    }

    // Hash password if it exists
    let hashedPassword = formData.password;
    if (formData.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(formData.password, salt);
    }

    const user = await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            name: formData.name,
            surname: formData.surname,
            gender: formData.gender,
            email: formData.email,
            password: hashedPassword,
            status: false,
            slug: generateSlug(formData.name + ' ' + formData.surname),
            title: formData.title,
            phone: formData.phone,
            profile_image: imageUrl || formData.image || undefined
        }
    });
    return user;
}

export async function getContactInfo() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }
    const user = await prisma.user.findFirst({
        where: {
            id: session.user.id,
        },
    });
    return user;
}

export async function createEducation(formData: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    // Get user from database first to ensure we have the correct ID
    const user = await prisma.user.findFirst({
        where: {
            email: session.user?.email
        }
    });

    if (!user?.id) {
        throw new Error('User not found');
    }

    try {
        const education = await prisma.education.create({
            data: {
                university_name: formData.schoolName || '',
                educational_degree: formData.degree_type || '',
                department: formData.degree || '',
                start_date: formData.startDate ? new Date(formData.startDate) : null,
                end_date: formData.endDate ? new Date(formData.endDate) : null,
                status: true,
                consultant: {
                    connect: {
                        id: user.id  // Use the fetched user ID
                    }
                }
            }
        });
        return education;
    } catch (error: any) {
        console.error('Error creating education:', error?.message || 'Unknown error');
        throw new Error(error?.message || 'Failed to create education');
    }
}

export async function getEducations() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const educations = await prisma.education.findMany({
            where: {
                consultant_id: session.user.id,
                status: true
            },
            orderBy: {
                start_date: 'desc'
            }
        });

        return educations;
    } catch (error) {
        console.error('Error fetching educations:', error);
        throw error;
    }
}

export async function updateEducation(id: number, formData: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const education = await prisma.education.update({
            where: {
                education_id: id,
                consultant_id: session.user.id
            },
            data: {
                university_name: formData.schoolName || '',
                educational_degree: formData.degree_type || '',
                department: formData.degree || '',
                start_date: formData.startDate ? new Date(formData.startDate) : null,
                end_date: formData.endDate ? new Date(formData.endDate) : null
            }
        });
        return education;
    } catch (error) {
        console.error('Error updating education:', error);
        throw error;
    }
}

export async function deleteEducation(id: number) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const education = await prisma.education.update({
            where: {
                education_id: id,
                consultant_id: session.user.id  // Security check
            },
            data: {
                status: false
            }
        });

        return education;
    } catch (error) {
        console.error('Error deleting education:', error);
        throw error;
    }
}

export async function createCertificate(formData: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findFirst({
        where: {
            email: session.user?.email
        }
    });

    if (!user?.id) {
        throw new Error('User not found');
    }

    try {
        const certificate = await prisma.certificate.create({
            data: {
                certificate_name: formData.certificateName || '',
                issuing_organization: formData.organization || '',
                given_date: formData.givenDate ? new Date(formData.givenDate) : null,
                status: true,
                consultant: {
                    connect: {
                        id: user.id
                    }
                }
            }
        });
        return certificate;
    } catch (error: any) {
        console.error('Error creating certificate:', error?.message || 'Unknown error');
        throw new Error(error?.message || 'Failed to create certificate');
    }
}

export async function getCertificates() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const certificates = await prisma.certificate.findMany({
            where: {
                consultant_id: session.user.id,
                status: true
            },
            orderBy: {
                given_date: 'desc'
            }
        });
        return certificates;
    } catch (error: any) {
        console.error('Error fetching certificates:', error?.message || 'Unknown error');
        throw error;
    }
}

export async function deleteCertificate(id: number) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const certificate = await prisma.certificate.update({
            where: {
                certificate_id: id,
                consultant_id: session.user.id
            },
            data: {
                status: false
            }
        });
        return certificate;
    } catch (error: any) {
        console.error('Error deleting certificate:', error?.message || 'Unknown error');
        throw error;
    }
}

export async function updateCertificate(id: number, formData: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const certificate = await prisma.certificate.update({
            where: {
                certificate_id: id,
                consultant_id: session.user.id
            },
            data: {
                certificate_name: formData.certificateName || '',
                issuing_organization: formData.organization || '',
                given_date: formData.givenDate ? new Date(formData.givenDate) : null
            }
        });
        return certificate;
    } catch (error: any) {
        console.error('Error updating certificate:', error?.message || 'Unknown error');
        throw new Error(error?.message || 'Failed to update certificate');
    }
}

export async function getExpertises() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const expertises = await prisma.expertise.findMany({
            where: {
                status: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        return expertises;
    } catch (error: any) {
        console.error('Error fetching expertises:', error?.message || 'Unknown error');
        throw error;
    }
}

export async function getConsultantExpertises() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findFirst({
        where: {
            email: session.user?.email
        }
    });

    if (!user?.id) {
        throw new Error('User not found');
    }

    try {
        const consultantExpertises = await prisma.consultantExpertiseLink.findMany({
            where: {
                consultant_id: user.id
            },
            include: {
                expertise: true
            }
        });

        return consultantExpertises.map(ce => ({
            id: ce.id,
            consultant_id: ce.consultant_id,
            expertise_id: ce.expertise_id,
            workspaces: ce.workspaces ? JSON.parse(ce.workspaces as string) : [],
            expertise: ce.expertise
        } as ConsultantExpertise));
    } catch (error: any) {
        console.error('Error fetching consultant expertises:', error?.message || 'Unknown error');
        throw error;
    }
}

export async function createConsultantExpertise(formData: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findFirst({
        where: {
            email: session.user?.email
        }
    });

    if (!user?.id) {
        throw new Error('User not found');
    }

    try {
        const workspaceObjects = formData.workspaces 
            ? await prisma.workspace.findMany({
                where: {
                    workspace_id: {
                        in: formData.workspaces.map((id: string) => parseInt(id))
                    }
                }
            }) 
            : [];

        const consultantExpertise = await prisma.consultantExpertiseLink.create({
            data: {
                consultant: {
                    connect: { id: user.id }
                },
                expertise: {
                    connect: { expertise_id: parseInt(formData.expertise) }
                },
                workspaces: JSON.stringify(workspaceObjects) as any
            },
            include: {
                expertise: true
            }
        });

        return {
            ...consultantExpertise,
            workspaces: workspaceObjects,
            expertise: consultantExpertise.expertise
        } as ConsultantExpertise;
    } catch (error: any) {
        console.error('Error creating consultant expertise:', error?.message || 'Unknown error');
        throw new Error(error?.message || 'Failed to create expertise');
    }
}

export async function deleteConsultantExpertise(id: number) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findFirst({
        where: {
            email: session.user?.email
        }
    });

    if (!user?.id) {
        throw new Error('User not found');
    }

    try {
        await prisma.consultantExpertiseLink.delete({
            where: {
                id: id,
                consultant_id: user.id
            }
        });
    } catch (error: any) {
        console.error('Error deleting consultant expertise:', error?.message || 'Unknown error');
        throw new Error(error?.message || 'Failed to delete expertise');
    }
}

export async function getWorkspaces() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const workspaces = await prisma.workspace.findMany({
            where: {
                status: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        return workspaces;
    } catch (error: any) {
        console.error('Error fetching workspaces:', error?.message || 'Unknown error');
        throw error;
    }
}

export async function updateConsultantExpertise(id: number, formData: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const workspaceObjects = formData.workspaces 
            ? await prisma.workspace.findMany({
                where: {
                    workspace_id: {
                        in: formData.workspaces.map((id: string) => parseInt(id))
                    }
                }
            }) 
            : [];

        const consultantExpertise = await prisma.consultantExpertiseLink.update({
            where: {
                id: id
            },
            data: {
                expertise: {
                    connect: { expertise_id: parseInt(formData.expertise) }
                },
                workspaces: JSON.stringify(workspaceObjects) as any
            },
            include: {
                expertise: true
            }
        });

        return {
            ...consultantExpertise,
            workspaces: workspaceObjects,
            expertise: consultantExpertise.expertise
        } as ConsultantExpertise;
    } catch (error: any) {
        console.error('Error updating consultant expertise:', error?.message || 'Unknown error');
        throw new Error(error?.message || 'Failed to update expertise');
    }
}

export async function saveWeeklyCalendar(data: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    // Format the data in the exact structure needed
    const formattedData = {
        appointmentBuffer: data.appointmentBuffer,
        schedule: data.schedule.map((day: any) => ({
            dayId: day.dayId,
            dayName: DAYS.find((d) => d.id === day.dayId)?.name || '',
            hours: Array.from(day.hours || []).sort()
        }))
    };

    try {
        // Update user's latest_time_for_appointment
        await prisma.user.update({
            where: { id: session.user.id },
            data: { latest_time_for_appointment: parseInt(data.appointmentBuffer) }
        });

        // Save weekly calendar
        const existingCalendar = await prisma.weeklyCalendar.findFirst({
            where: {
                consultant_id: session.user.id,
                status: true
            }
        });

        if (existingCalendar) {
            return await prisma.weeklyCalendar.update({
                where: { weekly_calendar_id: existingCalendar.weekly_calendar_id },
                data: { day_and_hours: formattedData }
            });
        }

        return await prisma.weeklyCalendar.create({
            data: {
                consultant_id: session.user.id,
                day_and_hours: formattedData,
                status: true
            }
        });
    } catch (error) {
        console.error('Error saving weekly calendar:', error);
        throw error;
    }
}

export async function getWeeklyCalendar() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const [calendar, user] = await Promise.all([
            prisma.weeklyCalendar.findFirst({
                where: {
                    consultant_id: session.user.id,
                    status: true
                }
            }),
            prisma.user.findUnique({
                where: { id: session.user.id },
                select: { latest_time_for_appointment: true }
            })
        ]);

        // If no calendar exists, return default structure
        if (!calendar) {
            return {
                day_and_hours: {
                    schedule: [],
                    appointmentBuffer: user?.latest_time_for_appointment?.toString() || '1'
                }
            };
        }

        if (calendar.day_and_hours) {
            const dayAndHours = typeof calendar.day_and_hours === 'string'
                ? JSON.parse(calendar.day_and_hours)
                : calendar.day_and_hours;

            return {
                ...calendar,
                day_and_hours: {
                    ...dayAndHours,
                    appointmentBuffer: user?.latest_time_for_appointment?.toString() || '1'
                }
            };
        }

        return calendar;
    } catch (error) {
        console.error('Error getting weekly calendar:', error);
        throw error;
    }
}

export async function saveMeetingOptions(data: { platforms: string[], languages: string[] }) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        // First delete existing options and languages
        await prisma.meetingOption.deleteMany({
            where: { user_id: session.user.id }
        });
        await prisma.language.deleteMany({
            where: { user_id: session.user.id }
        });

        // Create new meeting options
        const meetingOptions = await Promise.all(
            data.platforms.map(platform =>
                prisma.meetingOption.create({
                    data: {
                        name: platform,
                        user: { connect: { id: session.user.id } }
                    }
                })
            )
        );

        // Create new languages
        const languages = await Promise.all(
            data.languages.map(language =>
                prisma.language.create({
                    data: {
                        name: language,
                        user: { connect: { id: session.user.id } }
                    }
                })
            )
        );

        return { meetingOptions, languages };
    } catch (error) {
        console.error('Error saving meeting options:', error);
        throw error;
    }
}

export async function getMeetingOptions() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const [meetingOptions, languages] = await Promise.all([
            prisma.meetingOption.findMany({
                where: { user_id: session.user.id }
            }),
            prisma.language.findMany({
                where: { user_id: session.user.id }
            })
        ]);

        return { meetingOptions, languages };
    } catch (error) {
        console.error('Error getting meeting options:', error);
        throw error;
    }
}

export async function savePackets(packets: any[]) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        // Check if trying to add more than 5 packets
        if (packets.length > 5) {
            throw new Error('En fazla 5 paket ekleyebilirsiniz');
        }

        // First deactivate all existing packets
        await prisma.packet.updateMany({
            where: { 
                consultant_id: session.user.id,
                status: true
            },
            data: { status: false }
        });

        // Create new packets
        const savedPackets = await Promise.all(
            packets.map(packet =>
                prisma.packet.create({
                    data: {
                        packet_title: packet.title,
                        packet_type: packet.type === 'free' ? PacketType.FREE : 
                                   packet.type === 'startup' ? PacketType.STARTUP : 
                                   PacketType.PACKAGE,
                        packet_minutes: parseInt(packet.minutes) || 0,
                        meeting_times: parseInt(packet.meetingCount) || 0,
                        price: new Decimal(packet.price || 0),
                        discounted_price: new Decimal(packet.discountedPrice || 0),
                        meeting_description: packet.description || '',
                        pre_questions: packet.preQuestions || '',
                        status: true,
                        consultant: { connect: { id: session.user.id } }
                    }
                })
            )
        );

        return savedPackets.map(packet => ({
            ...packet,
            price: packet.price.toString(),
            discounted_price: packet.discounted_price.toString(),
            createdAt: packet.createdAt.toISOString(),
            updatedAt: packet.updatedAt.toISOString()
        }));

    } catch (error) {
        console.error('Error saving packets:', error);
        throw error;
    }
}

export async function getPackets() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const packets = await prisma.packet.findMany({
            where: {
                consultant_id: session.user.id,
                status: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Convert all Decimal and Date values to strings
        return packets.map(packet => ({
            packet_id: packet.packet_id,
            packet_type: packet.packet_type,
            packet_title: packet.packet_title,
            packet_minutes: packet.packet_minutes,
            meeting_times: packet.meeting_times,
            price: packet.price.toString(),
            discounted_price: packet.discounted_price.toString(),
            meeting_description: packet.meeting_description,
            pre_questions: packet.pre_questions,
            status: packet.status,
            consultant_id: packet.consultant_id,
            createdAt: packet.createdAt.toISOString(),
            updatedAt: packet.updatedAt.toISOString()
        }));
    } catch (error) {
        console.error('Error getting packets:', error);
        throw error;
    }
}

export async function updateDescription(description: string) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: { description }
        });
        console.log(user);
    } catch (error) {
        console.error('Error updating description:', error);
        throw error;
    }
}

export async function saveBillingInfo(data: any) {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        const existingBilling = await prisma.billingInfo.findFirst({
            where: {
                consultant_id: session.user.id,
                status: true
            }
        });

        if (existingBilling) {
            return await prisma.billingInfo.update({
                where: { bill_id: existingBilling.bill_id },
                data: {
                    name: data.name,
                    surname: data.surname,
                    iban: data.iban,
                    tckn: data.tckn,
                    address: data.address,
                    city: data.city,
                    district: data.district
                }
            });
        }

        return await prisma.billingInfo.create({
            data: {
                name: data.name,
                surname: data.surname,
                iban: data.iban,
                tckn: data.tckn,
                address: data.address,
                city: data.city,
                district: data.district,
                status: true,
                consultant: { connect: { id: session.user.id } }
            }
        });
    } catch (error) {
        console.error('Error saving billing info:', error);
        throw error;
    }
}

export async function getBillingInfo() {
    const session = await getServerSession(authOptions) as SessionUser | null;
    if (!session) {
        redirect('/signin');
    }

    try {
        return await prisma.billingInfo.findFirst({
            where: {
                consultant_id: session.user.id,
                status: true
            }
        });
    } catch (error) {
        console.error('Error getting billing info:', error);
        throw error;
    }
}

async function saveImage(base64Image: string): Promise<string> {
    try {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Use absolute path for uploads
        const uploadsDir = '/var/www/uploads/consultants';
        await mkdir(uploadsDir, { recursive: true });

        const uniqueId = crypto.randomUUID();
        const extension = base64Image.substring(base64Image.indexOf('/') + 1, base64Image.indexOf(';'));
        const filename = `consultant-${uniqueId}.${extension}`;
        const filepath = path.join(uploadsDir, filename);

        await writeFile(filepath, buffer);
        return `/uploads/consultants/${filename}`;
    } catch (error) {
        console.error('Error saving image:', error);
        throw error;
    }
}

export async function uploadImage(imageData: string) {
    try {
        const imageUrl = await saveImage(imageData);
        return { success: true, url: imageUrl };
    } catch (error) {
        return { success: false, error: 'Image upload failed' };
    }
}