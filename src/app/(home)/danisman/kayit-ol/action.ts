'use server';
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { sendNewConsultantNotification } from "@/lib/mail";

export async function registerConsultant(formData: any) {
    try {
        // Önce email kontrolü yapalım
        const existingUser = await prisma.user.findUnique({
            where: {
                email: formData.email
            }
        });

        if (existingUser) {
            throw new Error("Bu email adresi zaten kullanımda!");
        }

        // Hash password before saving
        const hashedPassword = await hashPassword(formData.password);

        const user = await prisma.user.create({
            data: {
                email: formData.email,
                password: hashedPassword,
                role: 'consultant',
                status: false,
            }
        });

        // Get admin users
        const adminUsers = await prisma.user.findMany({
            where: { role: 'admin' }
        });

        // Send notification to each admin
        for (const admin of adminUsers) {
            if (admin.email) {
                await sendNewConsultantNotification(admin.email, {
                    email: formData.email,
                    id: user.id
                });
            }
        }

        return user;
    } catch (error) {
        throw error;
    }
}
