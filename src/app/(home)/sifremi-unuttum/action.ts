'use server';
import { sendPasswordResetEmailLink } from "@/lib/mail";

export async function sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmailLink(email);
    return { success: true, message: "Şifre sıfırlama linki gönderildi" };
} 