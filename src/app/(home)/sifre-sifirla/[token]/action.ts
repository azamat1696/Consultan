'use server';
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function resetPassword(token: string, newPassword: string) {
    try {
        // Token'ı kontrol et
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            throw new Error("Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı");
        }

        // Yeni şifreyi hashle
        const hashedPassword = await hashPassword(newPassword);

        // Şifreyi güncelle ve token'ları temizle
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
} 