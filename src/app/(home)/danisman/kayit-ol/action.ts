'use server';
import prisma from "@/lib/db";

export async function registerConsultant(formData: any) {
    const user = await  prisma.user.create(
        {
            data: {
                email: formData.email,
                password: formData.password,
                role: 'consultant',
                status: false,
            }
        }
    )
    return user;
}
