"use server"
import prisma from "@/lib/db";
import { createLog } from "@/lib/logger";

export async function getWorkspaces() {
  try {
    return await prisma.workspace.findMany({
      where: { 
        deletedAt: null
      },
      orderBy: { workspace_id: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
}

export async function createWorkspace(name: string, status: boolean = true) {
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        status
      }
    });

    await createLog({
      type: "CREATE",
      action: "Çalışma Alanı Ekleme",
      description: `${name} çalışma alanı eklendi. Durum: ${status ? 'Aktif' : 'Pasif'}`
    });

    return workspace;
  } catch (error) {
    console.error('Error creating workspace:', error);
    await createLog({
      type: "ERROR",
      action: "Çalışma Alanı Ekleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function updateWorkspace(id: number, name: string, status: boolean) {
  try {
    const workspace = await prisma.workspace.update({
      where: { workspace_id: id },
      data: { 
        name,
        status
      }
    });

    await createLog({
      type: "UPDATE",
      action: "Çalışma Alanı Güncelleme",
      description: `ID: ${id} çalışma alanı güncellendi. Durum: ${status ? 'Aktif' : 'Pasif'}`
    });

    return workspace;
  } catch (error) {
    console.error('Error updating workspace:', error);
    await createLog({
      type: "ERROR",
      action: "Çalışma Alanı Güncelleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function deleteWorkspace(id: number) {
  try {
    const workspace = await prisma.workspace.update({
      where: { workspace_id: id },
      data: { 
        status: false,
        deletedAt: new Date()
      }
    });

    await createLog({
      type: "DELETE",
      action: "Çalışma Alanı Silme",
      description: `ID: ${id} çalışma alanı silindi.`
    });

    return workspace;
  } catch (error) {
    console.error('Error deleting workspace:', error);
    await createLog({
      type: "ERROR",
      action: "Çalışma Alanı Silme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
} 