"use server"
import prisma from "@/lib/db";
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createLog } from "@/lib/logger";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

async function saveImage(base64Image: string): Promise<string> {
  try {
    // Eğer zaten bir URL ise
    if (!base64Image.startsWith('data:image')) {
      return base64Image;
    }

    // Base64 formatını kontrol et
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif);base64,/;
    if (!base64Regex.test(base64Image)) {
      throw new Error('Geçersiz görsel formatı');
    }

    // Base64'den buffer'a çevir
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Dosya uzantısını al
    const extension = base64Image.split(';')[0].split('/')[1];
    
    // Klasör oluştur
    const uploadsDir = path.join(process.cwd(), 'uploads', 'sliders');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Benzersiz dosya adı oluştur
    const uniqueId = crypto.randomUUID();
    const filename = `slider-${uniqueId}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Dosyayı kaydet
    await fs.writeFile(filepath, buffer);

    return `/uploads/sliders/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Görsel kaydedilirken bir hata oluştu');
  }
}

async function deleteImage(imageUrl: string) {
  try {
    if (!imageUrl || !imageUrl.startsWith('/uploads/sliders/')) return;

    const filepath = path.join(process.cwd(), imageUrl);
    const exists = await fs.access(filepath).then(() => true).catch(() => false);
    
    if (exists) {
      await fs.unlink(filepath);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

async function deleteUploadThingImage(imageUrl: string | null) {
  if (!imageUrl) return;
  
  try {
    // URL'den dosya key'ini çıkar
    const fileKey = imageUrl.split('/').pop();
    if (fileKey) {
      await utapi.deleteFiles(fileKey);
      console.log('Image deleted from UploadThing:', fileKey);
    }
  } catch (error) {
    console.error('Error deleting image from UploadThing:', error);
  }
}

export async function getSliders() {
  try {
    return await prisma.slider.findMany({
      where: {
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    throw error;
  }
}

export async function addSlider(data: any) {
  try {
    const slider = await prisma.slider.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        mobileImage: data.mobileImage,
        status: data.status,
      }
    });

    await createLog({
      type: "CREATE",
      action: "Slider Ekleme",
      description: `"${data.title}" başlıklı slider eklendi.`
    });

    return slider;
  } catch (error) {
    console.error('Error adding slider:', error);
    throw error;
  }
}

export async function updateSlider(id: number, data: any) {
  try {
    // Önce mevcut slider'ı al
    const existingSlider = await prisma.slider.findUnique({
      where: { id }
    });

    if (!existingSlider) {
      throw new Error('Slider bulunamadı');
    }

    // Eğer yeni bir görsel yüklendiyse, eski görseli sil
    if (data.image !== existingSlider.image) {
      await deleteUploadThingImage(existingSlider.image);
    }

    // Eğer yeni bir mobil görsel yüklendiyse, eski mobil görseli sil
    if (data.mobileImage !== existingSlider.mobileImage) {
      await deleteUploadThingImage(existingSlider.mobileImage);
    }

    // Slider'ı güncelle
    const slider = await prisma.slider.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        mobileImage: data.mobileImage,
        status: data.status,
      }
    });

    await createLog({
      type: "UPDATE",
      action: "Slider Güncelleme",
      description: `ID: ${id} - "${data.title}" başlıklı slider güncellendi.`
    });

    return slider;
  } catch (error) {
    console.error('Error updating slider:', error);
    throw error;
  }
}

export async function deleteSlider(id: number) {
  try {
    // Önce slider'ı al
    const slider = await prisma.slider.findUnique({
      where: { id }
    });

    if (!slider) {
      throw new Error('Slider bulunamadı');
    }

    // Görselleri Uploadthing'den sil
    await deleteUploadThingImage(slider.image);
    await deleteUploadThingImage(slider.mobileImage);

    // Slider'ı veritabanından sil (veya soft delete)
    const deletedSlider = await prisma.slider.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    await createLog({
      type: "DELETE",
      action: "Slider Silme",
      description: `ID: ${id} slider silindi.`
    });

    return deletedSlider;
  } catch (error) {
    console.error('Error deleting slider:', error);
    await createLog({
      type: "ERROR",
      action: "Slider Silme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
} 