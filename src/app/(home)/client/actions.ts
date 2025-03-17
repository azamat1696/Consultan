'use server'

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hashPassword, comparePassword } from "@/lib/password";

export async function updateGeneralInfo(userId: number, data: {
    name: string;
    surname: string;
    phone: string | null;
}) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                surname: data.surname,
                phone: data.phone
            },
            select: {
                name: true,
                surname: true,
                phone: true
            }
        });

        revalidatePath('/client');
        return { success: true, data: user };
    } catch (error) {
        console.error('Error updating user info:', error);
        return { success: false, error: 'Bilgiler güncellenirken bir hata oluştu' };
    }
}

export async function getUserInfo(userId: number): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                surname: true,
                email: true,
                phone: true
            }
        });

        return {
            success: true,
            data: user
        };
    } catch (error) {
        console.error('Error fetching user info:', error);
        return { success: false, error: 'Kullanıcı bilgileri alınırken bir hata oluştu' };
    }
}

export async function updatePassword(userId: number, data: {
    currentPassword: string;
    password: string;
}) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });

        if (!user || !user.password) {
            return { success: false, error: 'Kullanıcı bulunamadı' };
        }

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(data.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return { success: false, error: 'Mevcut şifre yanlış' };
        }

        // Hash the new password
        const hashedPassword = await hashPassword(data.password);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        revalidatePath('/client');
        return { success: true };
    } catch (error) {
        console.error('Error updating password:', error);
        return { success: false, error: 'Şifre güncellenirken bir hata oluştu' };
    }
}

export async function getUserOrders(userId: number): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
        const orders = await prisma.appointment.findMany({
            where: {
                client_id: userId,
                deletedAt: null
            },
            include: {
                consultant: {
                    select: {
                        name: true,
                        surname: true
                    }
                },
                packet: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        /*
        appointment_id Int      @id @default(autoincrement())
        date_time      DateTime
        appointment_time String?
        packet         Packet   @relation(fields: [packet_id], references: [packet_id])
        packet_id      Int
        consultant     User     @relation("ConsultantAppointments", fields: [consultant_id], references: [id])
        consultant_id  Int
        client         User     @relation("ClientAppointments", fields: [client_id], references: [id])
        client_id      Int
        status         AppointmentStatus?
        deletedAt      DateTime?
        createdAt      DateTime @default(now())
        updatedAt      DateTime @updatedAt
        */

        return {
            success: true,
            data: orders
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false, error: 'Siparişler alınırken bir hata oluştu' };
    }
} 