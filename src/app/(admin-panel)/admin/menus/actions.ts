"use server"
import prisma from "@/lib/db";
import { createLog } from "@/lib/logger";

export async function getMenus() {
  try {
    const data = await prisma.menu.findMany({
      orderBy: [
        { order_number: 'asc' },
        { createdAt: 'desc' },
        { order_number: 'desc' }
      ],
      include: {
        parent: true,
        category: {
          where: {
            deletedAt: null
          }
        },
        categories: {
          where: {
            deletedAt: null
          }
        }
      },
      where: {
        deletedAt: null
      }
    });

    await createLog({
      type: "CREATE",
      action: "Menü Ekleme",
      description: `Menüler listelendi.`
    });

    return data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    await createLog({
      type: "ERROR",
      action: "Menüleri Listeleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function addMenu(data: any) {
  console.log(data);
  try {
    const menu = await prisma.menu.create({
      data: {
        title: data.title,
        type: data.type,
        page_path: data.page_path,
        order_number: data.order_number,
        parentId: data.parentId,
        categoryId: data.type === "Relation" ? data.categoryId : null,
        categories: data.type === "DropDown" ? {
          create: []
        } : undefined
      }
     });

    await createLog({
      type: "CREATE",
      action: "Menü Ekleme",
      description: `Menü eklendi.`
    });

    return menu;
  } catch (error) {
    console.error('Error adding menu:', error);
    await createLog({
      type: "ERROR",
      action: "Menü Ekleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function updateMenu(id: number, data: any) {
  try {
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        page_path: data.page_path,
        order_number: data.order_number,
        parentId: data.parentId
      }
      });

    await createLog({
      type: "UPDATE",
      action: "Menü Güncelleme",
      description: `Menü güncellendi.`
    });

    return menu;
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
}

export async function deleteMenu(id: number) {
  try {
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    await createLog({
      type: "DELETE",
      action: "Menü Silme",
      description: `ID: ${id} menü silindi.`
    });

    return menu;
  } catch (error) {
    console.error('Error deleting menu:', error);
    await createLog({
      type: "ERROR",
      action: "Menü Silme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
} 