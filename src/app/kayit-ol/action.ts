'use server';
import prisma from "@/lib/db";

export async function registerClient(formData: any) {
    const user = await  prisma.user.create(
        {
            data: {
                email: formData.email,
                password: formData.password,
                role: 'client',
                status: false,
            }
        }
    )
    return user;
}
