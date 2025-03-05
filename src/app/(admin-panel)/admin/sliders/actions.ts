"use server"
import prisma from "@/lib/db";
import { createLog } from "@/lib/logger";
import { uploadImage, deleteImage } from "@/lib/upload";

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
      imageUrl = await uploadImage(data.image, 'sliders');
    }
    if (data.mobileImage) {
      mobileImageUrl = await uploadImage(data.mobileImage, 'sliders');
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
      await deleteImage(currentSlider?.image || null, 'sliders');
      imageUrl = await uploadImage(data.image, 'sliders');
    }

    if (data.mobileImage && data.mobileImage !== currentSlider?.mobileImage && data.mobileImage.startsWith('data:image')) {
      await deleteImage(currentSlider?.mobileImage || null, 'sliders');
      mobileImageUrl = await uploadImage(data.mobileImage, 'sliders');
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