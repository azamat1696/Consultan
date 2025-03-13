"use server"
import prisma from "@/lib/db";
import crypto from 'crypto';
import { createLog } from "@/lib/logger";
import { sendPasswordResetEmail } from "@/lib/mail";
import { revalidateTag } from "next/cache";
import { hashPassword } from "@/lib/password";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage,deleteImage } from "@/lib/upload";

interface GetUsersParams {
  search?: string;
  role?: string | null;
  skip?: number;
  take?: number;
}

interface CreateUserData {
  name: string | null;
  surname: string | null;
  email: string | null;
  role: string | null;
  status: boolean;
  slug: string | null;
  profile_image?: any;
  gender?: "male" | "female" | "other" | null;
  phone?: string | null;
}

// Add type for session
interface SessionUser {
  user: {
    role: string;
    id: number;
  }
}

export async function getUsers(params: GetUsersParams = { search: "", role: null, skip: 0, take: 10 }) {
  try {
    const where = {
      deletedAt: null,
      name: { contains: params.search },
      ...(params.role && { role: params.role }),
    };

    const [data, count] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, count };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
 

export async function addUser(data: CreateUserData) {
  try {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }

    let imageUrl = null;
    if (data.profile_image instanceof File) {
      imageUrl = await uploadImage(data.profile_image as any, 'users');
    }

    // Generate and hash a random password
    const randomPassword = crypto.randomUUID().slice(0, 8);
    const hashedPassword = await hashPassword(randomPassword);

    const userData = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      role: data.role || 'user',
      status: data.status,
      profile_image: imageUrl,
      gender: data.gender,
      phone: data.phone,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = await prisma.user.create({ data: userData });

    sendPasswordResetEmail(data.email, randomPassword, data.name);

    await createLog({
      type: "CREATE",
      action: "Kullanıcı Ekleme",
      description: `Kullanıcı eklendi.`
    });

    return user;
  } catch (error) {
    console.error('Error adding user:', JSON.stringify(error));
    await createLog({
      type: "ERROR",
      action: "Kullanıcı Ekleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}



export async function updateUser(id: number, data: Partial<CreateUserData>) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // update profile image
    if (data.profile_image && data.profile_image !== existingUser.profile_image) {
      await deleteImage(existingUser.profile_image, 'users');
      data.profile_image = await uploadImage(data.profile_image as any, 'users');
    } else {
      // If no new image, keep the existing one
      data.profile_image = existingUser.profile_image;
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        role: data.role,
        status: data.status,
        profile_image: data.profile_image,
        gender: data.gender,
        phone: data.phone,
      }
    });

    await createLog({
      type: "UPDATE",
      action: "Kullanıcı Güncelleme",
      description: `Kullanıcı güncellendi.`
    });

    return user;
  } catch (error) {
    console.error('Error updating user:', JSON.stringify(error));
    await createLog({
      type: "ERROR",
      action: "Kullanıcı Güncelleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function deleteUser(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    // Profil resmini sil
    await deleteImage(user.profile_image, 'users');

    // Kullanıcıyı sil
    await prisma.user.delete({
      where: { id }
    });

    await createLog({
      type: "DELETE",
      action: "Kullanıcı Silme",
      description: `ID: ${id} kullanıcı silindi.`
    });

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    await createLog({
      type: "ERROR",
      action: "Kullanıcı Silme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function resetPassword(id: number, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, name: true, sessionVersion: true }
    });

    if (!user?.email) {
      throw new Error("User email not found");
    }

    const newSessionVersion = (user.sessionVersion || 0) + 1;
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { 
        password: hashedPassword,
        sessionVersion: newSessionVersion
      },
    });
    
    const emailSent = await sendPasswordResetEmail(
      user.email,
      newPassword,
      user.name || "Kullanıcı"
    );

    try {
      revalidateTag('session');
    } catch (e) {
      console.warn('Session revalidation failed:', e);
    }

    await createLog({
      type: "UPDATE",
      action: "Kullanıcı Şifre Sıfırlama",
      description: `ID: ${id} kullanıcı şifresi sıfırlandı. ${emailSent ? 'Email gönderildi.' : 'Email gönderilemedi.'}`
    });

    return { success: true, emailSent };
  } catch (error) {
    console.error('Error resetting password:', error);
    await createLog({
      type: "ERROR",
      action: "Kullanıcı Şifre Sıfırlama Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function getUser(id: number) {
  // check if user is admin and session is admin
  const session = await getServerSession(authOptions) as SessionUser | null;
  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  try {
    if (!id || isNaN(id)) {
      throw new Error('Invalid user ID');
    }
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        billingInfos: true,
        certificates: true, 
        educations: true,
        languages: true,
        consultantAppointments: true,
        consultantExpertiseLinks: {
          include: {
            expertise: true,
          }
        },
        expertKnowledges: true,
        meetingOptions: true,
        packets: true,
        weeklyCalendars: true,
      },
    });

    if (!user) return null;
    
    // Convert Decimal to number/string in packets
    return {
      ...user,
      packets: user.packets.map(packet => ({
        ...packet,
        price: Number(packet.price),
        discounted_price: packet.discounted_price ? Number(packet.discounted_price) : null
      })),
      meetingOptions: user.meetingOptions.map((option: any) => ({
        ...option,
        price: Number(option.price)
      }))
    };

  } catch (error) {
    console.error('Error fetching user:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      where: {
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' },
      include: {
        meetingOptions: true,
        languages: true,
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
} 