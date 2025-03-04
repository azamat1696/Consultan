"use server"
import prisma from "@/lib/db";
import { createLog } from "@/lib/logger";
import { softDelete } from "@/lib/softDelete";
import path from "path";
import { mkdir, writeFile } from 'fs/promises';
import crypto from "crypto";
import { generateSlug } from "@/lib/slug";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        categoryLinks: true,
        expertiseLinks: true,
        menu: true
      },
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

async function saveImage(base64Image: string): Promise<string> {
  try {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Use absolute path for uploads
    const uploadsDir = '/var/www/uploads/categories';
    await mkdir(uploadsDir, { recursive: true });

    const uniqueId = crypto.randomUUID();
    const extension = base64Image.substring(base64Image.indexOf('/') + 1, base64Image.indexOf(';'));
    const filename = `category-${uniqueId}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);
    return `/uploads/categories/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

interface CategoryData {
  title: string;
  menuId: number;
  page_path?: string | null;
  slug: string;
  image?: string | null;
  expertiseIds?: number[];
  workspaceIds?: number[];
}

async function checkSlugExists(slug: string, currentId?: number): Promise<boolean> {
  const existing = await prisma.category.findFirst({
    where: {
      slug,
      id: { not: currentId },
      deletedAt: null,
    },
  });
  return !!existing;
}

export async function addCategory(data: CategoryData) {
  try {
    if (await checkSlugExists(data.slug)) {
      throw new Error("Bu URL (slug) zaten kullanımda. Lütfen başka bir başlık veya slug kullanın.");
    }
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
        slug: data.slug,
        expertiseLinks: {
          create: data.expertiseIds?.map(expertiseId => ({
            expertise: { connect: { expertise_id: expertiseId } }
          })) || []
        },
        categoryLinks: {
          create: data.workspaceIds?.map(workspaceId => ({
            workspace: { connect: { workspace_id: workspaceId } }
          })) || []
        }
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

export async function updateCategory(id: number, data: CategoryData) {
  try {
    if (await checkSlugExists(data.slug, id)) {
      throw new Error("Bu URL (slug) zaten kullanımda. Lütfen başka bir başlık veya slug kullanın.");
    }
    let imageUrl = data.image;
    if (data.image && data.image.startsWith('data:image')) {
      imageUrl = await saveImage(data.image);
    }

    // Ensure all IDs are numbers
    const expertiseIds = data.expertiseIds?.map(Number);
    const workspaceIds = data.workspaceIds?.map(Number);

    // First delete relations that are no longer needed
    if (expertiseIds?.length) {
      await prisma.categoryExpertiseLink.deleteMany({
        where: {
          categoryId: id,
          expertiseId: { notIn: expertiseIds }
        }
      });
    }

    if (workspaceIds?.length) {
      await prisma.categoryWorkspaceLink.deleteMany({
        where: {
          categoryId: id,
          workspaceId: { notIn: workspaceIds }
        }
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        title: data.title,
        page_path: data.page_path,
        menuId: data.menuId,
        image: imageUrl,
        slug: data.slug,
        expertiseLinks: expertiseIds && expertiseIds.length > 0 ? {
          connectOrCreate: expertiseIds.map(expertiseId => ({
            where: {
              categoryId_expertiseId: {
                categoryId: id,
                expertiseId
              }
            },
            create: {
              expertise: { connect: { expertise_id: expertiseId } }
            }
          })),
        } : undefined,
        categoryLinks: workspaceIds && workspaceIds.length > 0 ? {
          connectOrCreate: workspaceIds.map(workspaceId => ({
            where: {
              categoryId_workspaceId: {
                categoryId: id,
                workspaceId
              }
            },
            create: {
              workspace: { connect: { workspace_id: workspaceId } }
            }
          })),
        } : undefined
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

export async function getExpertises() {
  try {
    const expertises = await prisma.expertise.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return expertises;
  } catch (error) {
    console.error('Error fetching expertises:', error);
    throw error;
  }
}

export async function getWorkspaces() {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        deletedAt: null,
        status: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return workspaces;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
}

