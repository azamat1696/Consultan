"use server"
import prisma from "@/lib/db";
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createLog } from "@/lib/logger";

async function saveImage(base64Image: string): Promise<string> {
  try {
    // Remove the data:image/[type];base64, prefix
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'sliders');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const uniqueId = crypto.randomUUID();
    const extension = base64Image.substring(base64Image.indexOf('/') + 1, base64Image.indexOf(';'));
    const filename = `slider-${uniqueId}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Save the file
    await fs.writeFile(filepath, buffer);

    // Return the public URL
    return `/uploads/sliders/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

async function deleteImage(imageUrl: string) {
  try {
    if (!imageUrl) return;

    const filepath = path.join(process.cwd(), 'public', imageUrl);
    await fs.unlink(filepath);
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
    // Get the current slider to check if we need to delete old image
    const currentSlider = await prisma.slider.findUnique({
      where: { id }
    });

    let imageUrl = data.image;
    let mobileImageUrl = data.mobileImage;
    
    // If new image is provided and it's different from current
    if (data.image && data.image !== currentSlider?.image && data.image.startsWith('data:image')) {
      // Delete old image if exists
      if (currentSlider?.image) {
        await deleteImage(currentSlider.image);
      }
      // Save new image
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