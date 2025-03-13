"use server"
import prisma from "@/lib/db";
import {redirect} from "next/navigation";
import { getServerSession } from "next-auth";
import {authOptions} from "@/lib/auth";
import { PacketType } from '@prisma/client';
import { createLog } from "@/lib/logger";
import crypto from "crypto";
import { hashPassword } from "@/lib/password";
import { Session } from 'next-auth'
import { uploadImage, deleteImage } from "@/lib/upload";

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

const DAYS = [
    { id: 1, name: 'Pazartesi' },
    { id: 2, name: 'Salı' },
    { id: 3, name: 'Çarşamba' },
    { id: 4, name: 'Perşembe' },
    { id: 5, name: 'Cuma' },
    { id: 6, name: 'Cumartesi' },
    { id: 7, name: 'Pazar' },
];

export async function contactInfoRegister(formData: any, id: number) {
    const session = await getServerSession(authOptions as any) as { user: { id: number } } | null;
    if (!session) {
        redirect('/signin');
    }
    const currentUser = await prisma.user.findUnique({
        where: { id },
        select: { profile_image: true }
    });
    console.log('formData',formData);
    let imageUrl = undefined;
    if (formData.image instanceof File) {
        await deleteImage(currentUser?.profile_image || null, 'users');
    }
    console.log('currentUser?.profile_image',currentUser?.profile_image);
    // Handle image upload
    if (formData.image instanceof File) {
         imageUrl = await uploadImage(formData.image as any, 'users');
    }

    // Hash password if it's being updated
    let hashedPassword = formData.password;
    if (formData.password) {
        hashedPassword = await hashPassword(formData.password);
    }

    const user = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            name: formData.name,
            surname: formData.surname,
            gender: formData.gender,
            email: formData.email,
            password: hashedPassword,
            title: formData.title,
            phone: formData.phone,
            slug: formData.slug,
            profile_image: imageUrl || formData.profile_image || undefined
        }
    });

    await createLog({
      type: "UPDATE",
      action: "Kullanıcı Güncelleme",
      description: `ID: ${id} kullanıcı güncellendi.`
    });

    return user;
}

export async function getContactInfo(id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }
    const user = await prisma.user.findFirst({
        where: {
            id: id,
        },
    });
    return user;
}

export async function createEducation(formData: any, id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    // Get user from database first to ensure we have the correct ID
    const user = await prisma.user.findFirst({
        where: {
            id: id
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

        await createLog({
            type: "CREATE",
            action: "Eğitim Ekleme",
            description: `ID: ${education.education_id} eğitim eklendi.`
        });

        return education;
    } catch (error: any) {
        console.error('Error creating education:', error?.message || 'Unknown error');
        await createLog({
            type: "ERROR",
            action: "Eğitim Ekleme Hatası",
            description: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
        throw new Error(error?.message || 'Failed to create education');
    }
}

export async function getEducations(id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const educations = await prisma.education.findMany({
            where: {
                consultant_id: id,
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

export async function updateEducation(id: number, formData: any, idNumber: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const education = await prisma.education.update({
            where: {
                education_id: id,
                consultant_id: idNumber
            },
            data: {
                university_name: formData.schoolName || '',
                educational_degree: formData.degree_type || '',
                department: formData.degree || '',
                start_date: formData.startDate ? new Date(formData.startDate) : null,
                end_date: formData.endDate ? new Date(formData.endDate) : null
            }
        });

        await createLog({
            type: "UPDATE",
            action: "Eğitim Güncelleme",
            description: `ID: ${education.education_id} eğitim güncellendi.`
        });

        return education;
    } catch (error) {
        console.error('Error updating education:', error);
        await createLog({
            type: "ERROR",
            action: "Eğitim Güncelleme Hatası",
            description: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
        throw error;
    }
}

export async function deleteEducation(id: number, idNumber: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const education = await prisma.education.update({
            where: {
                education_id: id,
                consultant_id: idNumber  // Security check
            },
            data: {
                status: false,
                deletedAt: new Date()
            }
        });

        await createLog({
            type: "DELETE",
            action: "Eğitim Silme",
            description: `ID: ${education.education_id} eğitim silindi.`
        });

        return education;
    } catch (error) {
        console.error('Error deleting education:', error);
        throw error;
    }
}

export async function createCertificate(formData: any, id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findFirst({
        where: {
            id: id
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

        await createLog({
            type: "CREATE",
            action: "Sertifika Ekleme",
            description: `ID: ${certificate.certificate_id} sertifika eklendi.`
        });

        return certificate;
    } catch (error: any) {
        console.error('Error creating certificate:', error?.message || 'Unknown error');
        throw new Error(error?.message || 'Failed to create certificate');
    }
}

export async function getCertificates(id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const certificates = await prisma.certificate.findMany({
            where: {
                consultant_id: id,
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

export async function deleteCertificate(id: number, idNumber: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const certificate = await prisma.certificate.update({
            where: {
                certificate_id: id,
                consultant_id: idNumber
            },
            data: {
                status: false
            }
        });

        await createLog({
            type: "DELETE",
            action: "Sertifika Silme",
            description: `ID: ${certificate.certificate_id} sertifika silindi.`
        });

        return certificate;
    } catch (error: any) {
        await createLog({
            type: "ERROR",
            action: "Sertifika Silme Hatası",
            description: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
        console.error('Error deleting certificate:', error?.message || 'Unknown error');
        throw error;
    }
}

export async function updateCertificate(id: number, formData: any, idNumber: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const certificate = await prisma.certificate.update({
            where: {
                certificate_id: id,
                consultant_id: idNumber
            },
            data: {
                certificate_name: formData.certificateName || '',
                issuing_organization: formData.organization || '',
                given_date: formData.givenDate ? new Date(formData.givenDate) : null
            }
        });

        await createLog({
            type: "UPDATE",
            action: "Sertifika Güncelleme",
            description: `ID: ${certificate.certificate_id} sertifika güncellendi.`
        });

        return certificate;
    } catch (error: any) {
        console.error('Error updating certificate:', error?.message || 'Unknown error');
        await createLog({
            type: "ERROR",
            action: "Sertifika Güncelleme Hatası",
            description: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
        throw new Error(error?.message || 'Failed to update certificate');
    }
}

export async function getExpertises() {
    const session = await getServerSession(authOptions as any);
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

export async function getConsultantExpertises(id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findFirst({
        where: {
            id: id
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

export async function createConsultantExpertise(formData: any, id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findFirst({
        where: {
            id: id
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

        await createLog({
            type: "CREATE",
            action: "Konsultan Eğitim Ekleme",
            description: `ID: ${consultantExpertise.id} konsultan eğitim eklendi.`
        });

        return {
            ...consultantExpertise,
            workspaces: workspaceObjects,
            expertise: consultantExpertise.expertise
        } as ConsultantExpertise;
    } catch (error: any) {
        console.error('Error creating consultant expertise:', error?.message || 'Unknown error');
        await createLog({
            type: "ERROR",
            action: "Konsultan Eğitim Ekleme Hatası",
            description: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
        throw new Error(error?.message || 'Failed to create expertise');
    }
}

export async function deleteConsultantExpertise(id: number, idNumber: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    const user = await prisma.user.findFirst({
        where: {
            id: idNumber
        }
    });

    if (!user?.id) {
        throw new Error('User not found');
    }

    try {
        await prisma.consultantExpertiseLink.update({
            where: {
                id: id,
                consultant_id: user.id
            },
            data: {
                deletedAt: new Date()
            }
        });

        await createLog({
            type: "DELETE",
            action: "Konsultan Eğitim Silme",
            description: `ID: ${id} konsultan eğitim silindi.`
        });
    } catch (error: any) {
        console.error('Error deleting consultant expertise:', error?.message || 'Unknown error');
        await createLog({
            type: "ERROR",
            action: "Konsultan Eğitim Silme Hatası",
            description: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
        throw new Error(error?.message || 'Failed to delete expertise');
    }
}

export async function getWorkspaces() {
    const session = await getServerSession();
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
    const session = await getServerSession(authOptions as any);
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

        await createLog({
            type: "UPDATE",
            action: "Konsultan Eğitim Güncelleme",
            description: `ID: ${id} konsultan eğitim güncellendi.`
        });

        return {
            ...consultantExpertise,
            workspaces: workspaceObjects,
            expertise: consultantExpertise.expertise
        } as ConsultantExpertise;
    } catch (error: any) {
        console.error('Error updating consultant expertise:', error?.message || 'Unknown error');
        await createLog({
            type: "ERROR",
            action: "Konsultan Eğitim Güncelleme Hatası",
            description: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
        throw new Error(error?.message || 'Failed to update expertise');
    }
}

export async function saveWeeklyCalendar(data: any, id: number) {
    const session = await getServerSession(authOptions as any);
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
            where: { id: id },
            data: { latest_time_for_appointment: parseInt(data.appointmentBuffer) }
        });

        await createLog({
            type: "UPDATE",
            action: "Konsultan Randevu Süresi Güncelleme",
            description: `ID: ${id} konsultan randevu süresi güncellendi.`
        });

        // Save weekly calendar
        const existingCalendar = await prisma.weeklyCalendar.findFirst({
            where: {
                consultant_id: id,
                status: true
            }
        });

        if (existingCalendar) {
            const calendar = await prisma.weeklyCalendar.update({
                where: { weekly_calendar_id: existingCalendar.weekly_calendar_id },
                data: { day_and_hours: formattedData }
            });
            await createLog({
                type: "UPDATE",
                action: "Konsultan Randevu Süresi Güncelleme",
                description: `ID: ${calendar.weekly_calendar_id} konsultan randevu süresi güncellendi.`
            });
            return calendar;
        }

    

        const calendar = await prisma.weeklyCalendar.create({
            data: {
                consultant_id: id,
                day_and_hours: formattedData,
                status: true
            }
        });

        await createLog({
            type: "CREATE",
            action: "Konsultan Randevu Süresi Ekleme",
            description: `ID: ${calendar.weekly_calendar_id} konsultan randevu süresi eklendi.`
        });

        return calendar;


    } catch (error) {
        console.error('Error saving weekly calendar:', error);
        await createLog({
            type: "ERROR",
            action: "Konsultan Randevu Süresi Güncelleme Hatası",
            description: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
        throw error;
    }
}

export async function getWeeklyCalendar(id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const [calendar, user] = await Promise.all([
            prisma.weeklyCalendar.findFirst({
                where: {
                    consultant_id: id,
                    status: true
                }
            }),
            prisma.user.findUnique({
                where: { id: id },
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

export async function saveMeetingOptions(data: { platforms: string[], languages: string[] }, id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        // First delete existing options and languages
        await prisma.meetingOption.deleteMany({
            where: { user_id: id }
        });
        await prisma.language.deleteMany({
            where: { user_id: id }
        });

        // Create new meeting options
        const meetingOptions = await Promise.all(
            data.platforms.map(platform =>
                prisma.meetingOption.create({
                    data: {
                        name: platform,
                        user: { connect: { id: id } }
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
                        user: { connect: { id: id } }
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

export async function getMeetingOptions(id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const [meetingOptions, languages] = await Promise.all([
            prisma.meetingOption.findMany({
                where: { user_id: id }
            }),
            prisma.language.findMany({
                where: { user_id: id }
            })
        ]);

        return { meetingOptions, languages };
    } catch (error) {
        console.error('Error getting meeting options:', error);
        throw error;
    }
}

export async function savePackets(packets: any[], id: number) {
    const session = await getServerSession(authOptions as any);
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
                consultant_id: id,
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
                        price: Number(packet.price || 0),
                        discounted_price: Number(packet.discountedPrice || 0),
                        meeting_description: packet.description || '',
                        pre_questions: packet.preQuestions || '',
                        status: true,
                        consultant: { connect: { id: id } }
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

export async function getPackets(id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const packets = await prisma.packet.findMany({
            where: {
                consultant_id: id,
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

export async function updateDescription(description: string, id: number) {
    try {
        const session = await getServerSession(authOptions as any);
        if (!session) {
            redirect('/signin');
        }

        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                description: description
            }
        });

        await createLog({
            type: "UPDATE",
            action: "UPDATE_USER_DESCRIPTION",
            description: `Updated description for user ${id}`
        });

        return user;
    } catch (error) {
        console.log('Error updating description:', JSON.stringify(error));
        throw error;
    }
}

export async function saveBillingInfo(data: any, id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        const existingBilling = await prisma.billingInfo.findFirst({
            where: {
                consultant_id: id,
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
                consultant: { connect: { id: id } }
            }
        });
    } catch (error) {
        console.error('Error saving billing info:', error);
        throw error;
    }
}

export async function getBillingInfo(id: number) {
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect('/signin');
    }

    try {
        return await prisma.billingInfo.findFirst({
            where: {
                consultant_id: id,
                status: true
            }
        });
    } catch (error) {
        console.error('Error getting billing info:', error);
        throw error;
    }
}


export async function uploadImages(imageData: string) {
    try {
        const imageUrl = await uploadImage(imageData,'users');
        return { success: true, url: imageUrl };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, error: 'Image upload failed' };
    }
}

