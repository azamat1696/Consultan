"use server"
import prisma from "@/lib/db";
import { createLog } from "@/lib/logger";

export async function getExpertises() {
  try {
    return await prisma.expertise.findMany({
      where: { 
        deletedAt: null
      },
      orderBy: { expertise_id: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching expertises:', error);
    throw error;
  }
}

export async function createExpertise(name: string, status: boolean = true, slug: string) {
  try {
    const expertise = await prisma.expertise.create({
      data: {
        name,
        status,
        slug
      }
    });

    await createLog({
      type: "CREATE",
      action: "Uzmanlık Alanı Ekleme",
      description: `${name} uzmanlık alanı eklendi. Durum: ${status ? 'Aktif' : 'Pasif'}`
    });

    return expertise;
  } catch (error) {
    console.error('Error creating expertise:', error);
    await createLog({
      type: "ERROR",
      action: "Uzmanlık Alanı Ekleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function updateExpertise(id: number, name: string, status: boolean, slug: string) {
  try {
    const expertise = await prisma.expertise.update({
      where: { expertise_id: id },
      data: { 
        name,
        status,
        slug
      }
    });

    await createLog({
      type: "UPDATE",
      action: "Uzmanlık Alanı Güncelleme",
      description: `ID: ${id} uzmanlık alanı güncellendi. Durum: ${status ? 'Aktif' : 'Pasif'}`
    });

    return expertise;
  } catch (error) {
    console.error('Error updating expertise:', error);
    await createLog({
      type: "ERROR",
      action: "Uzmanlık Alanı Güncelleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function deleteExpertise(id: number) {
  try {
    const expertise = await prisma.expertise.update({
      where: { expertise_id: id },
      data: { 
        status: false,
        deletedAt: new Date()
      }
    });

    await createLog({
      type: "DELETE",
      action: "Uzmanlık Alanı Silme",
      description: `ID: ${id} uzmanlık alanı silindi.`
    });

    return expertise;
  } catch (error) {
    console.error('Error deleting expertise:', error);
    await createLog({
      type: "ERROR",
      action: "Uzmanlık Alanı Silme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
} 