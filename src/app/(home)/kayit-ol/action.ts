'use server';
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { sendWelcomeEmail } from "@/lib/mail";

export async function registerClient(formData: any) {
    try {
        const user = await prisma.user.create({
            data: {
                email: formData.email,
                password: await hashPassword(formData.password),
                role: 'client',
                status: false,
            }
        });

        // Send welcome email if email exists
        if (user.email) {
            await sendWelcomeEmail(user.email);
        }
        
        return user;
    } catch (error) {
        console.error('Error during client registration:', error);
        throw error;
    }
}
