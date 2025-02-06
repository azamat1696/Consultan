"use server"
import prisma from "@/lib/db";
import { User } from "@prisma/client";
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createLog } from "@/lib/logger";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";

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
  profile_image?: any;
  gender?: "male" | "female" | "other" | null;
  phone?: string | null;
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

async function saveImage(file: File, prefix: string = 'user') {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'users');
    await fs.mkdir(uploadsDir, { recursive: true });

    const uniqueId = crypto.randomUUID();
    const ext = path.extname(file.name);
    const fileName = `${prefix}-${uniqueId}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return `/uploads/users/${fileName}`;
  } catch (error) {
    console.error('Error saving image:', error);
    return null;
  }
}

export async function addUser(data: CreateUserData) {
  try {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }

    let imageUrl = null;
    if (data.profile_image instanceof File) {
      imageUrl = await saveImage(data.profile_image);
    }

    const userData = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      role: data.role || 'user',
      status: data.status,
      profile_image: imageUrl,
      gender: data.gender,
      phone: data.phone,
      password: crypto.randomUUID().slice(0, 8), // More reliable than Math.random
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = await prisma.user.create({ data: userData });

    await createLog({
      type: "CREATE",
      action: "Kullanıcı Ekleme",
      description: `Kullanıcı eklendi.`
    });

    return user;
  } catch (error) {
    console.error('Error adding user:', error);
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
    let imageUrl = data.profile_image;
    if (data.profile_image instanceof File) {
      imageUrl = await saveImage(data.profile_image);
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        role: data.role,
        status: data.status,
        profile_image: imageUrl,
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
    console.error('Error updating user:', error);
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
    const user = await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    await createLog({
      type: "DELETE",
      action: "Kullanıcı Silme",
      description: `ID: ${id} kullanıcı silindi.`
    });

    return user;
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

    await prisma.user.update({
      where: { id },
      data: { 
        password: newPassword,
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
      meetingOptions: user.meetingOptions.map(option => ({
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