"use server"
import prisma from "@/lib/db";
import { createLog } from "@/lib/logger";
import { softDelete } from "@/lib/softDelete";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        menu: true,
        parentMenus: true
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

async function saveImage(base64Image: string): Promise<string> {
  try {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'categories');
    await fs.mkdir(uploadsDir, { recursive: true });

    const uniqueId = crypto.randomUUID();
    const extension = base64Image.substring(base64Image.indexOf('/') + 1, base64Image.indexOf(';'));
    const filename = `category-${uniqueId}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    await fs.writeFile(filepath, buffer);
    return `/uploads/categories/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

export async function addCategory(data: any) {
  try {
    let imageUrl = '';
    if (data.image) {
      imageUrl = await saveImage(data.image);
    }

    const category = await prisma.category.create({
      data: {
        title: data.title,
        page_path: data.page_path,
        menuId: data.menuId,
        image: imageUrl,
      }
    });
    await createLog({
      type: "CREATE",
      action: "Kategori Ekleme",
      description: `ID: ${category.id} kategori eklendi.`
    });
    return category;
  } catch (error) {
    console.error('Error adding category:', error);
    await createLog({
      type: "ERROR",
      action: "Kategori Ekleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function updateCategory(id: number, data: any) {
  try {
    let imageUrl = data.image;
    if (data.image && data.image.startsWith('data:image')) {
      imageUrl = await saveImage(data.image);
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        title: data.title,
        page_path: data.page_path,
        menuId: data.menuId,
        image: imageUrl,
      }
    });
    await createLog({
      type: "UPDATE",
      action: "Kategori Güncelleme",
      description: `ID: ${category.id} kategori güncellendi.`
    });
    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    await createLog({
      type: "ERROR",
      action: "Kategori Güncelleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function deleteCategory(id: number) {
    return softDelete('Category', id);
} 