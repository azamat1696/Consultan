"use server"
import prisma from "@/lib/db";
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createLog } from "@/lib/logger";

function getUploadPath(folder: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const basePath = isProduction ? '/var/www/uploads' : path.join(process.cwd(), 'public');
  return path.join(basePath, folder);
}

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
    const uploadsDir = getUploadPath('uploads/sliders');
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
    if (!imageUrl) return;

    // Handle both local and external URLs
    if (imageUrl.startsWith('http')) {
      return; // Skip deletion for external URLs
    }

    // Extract filename from URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    const filePath = path.join(getUploadPath('uploads/sliders'), fileName);
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    
    if (exists) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
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
    let imageUrl = '';
    let mobileImageUrl = '';
    
    if (data.image) {
      imageUrl = await saveImage(data.image);
    }
    if (data.mobileImage) {
      mobileImageUrl = await saveImage(data.mobileImage);
    }

    const slider = await prisma.slider.create({
      data: {
        title: data.title,
        description: data.description,
        image: imageUrl,
        mobileImage: mobileImageUrl,
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
    await createLog({
      type: "ERROR",
      action: "Slider Ekleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function updateSlider(id: number, data: any) {
  try {
    const currentSlider = await prisma.slider.findUnique({
      where: { id }
    });

    let imageUrl = data.image;
    let mobileImageUrl = data.mobileImage;
    
    if (data.image && data.image !== currentSlider?.image && data.image.startsWith('data:image')) {
      if (currentSlider?.image) {
        await deleteImage(currentSlider.image);
      }
      imageUrl = await saveImage(data.image);
    }

    if (data.mobileImage && data.mobileImage !== currentSlider?.mobileImage && data.mobileImage.startsWith('data:image')) {
      if (currentSlider?.mobileImage) {
        await deleteImage(currentSlider.mobileImage);
      }
      mobileImageUrl = await saveImage(data.mobileImage);
    }

    const slider = await prisma.slider.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: imageUrl,
        mobileImage: mobileImageUrl,
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
    await createLog({
      type: "ERROR",
      action: "Slider Güncelleme Hatası",
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
}

export async function deleteSlider(id: number) {
  try {
    const slider = await prisma.slider.update({
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

    return slider;
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