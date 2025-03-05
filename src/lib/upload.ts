import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const UPLOAD_DIR = process.env.NODE_ENV === 'development'
  ? path.join(process.cwd(), 'public', 'uploads') // Save to public/uploads in development
  : '/var/www/uploads';
  console.log('>>>>>>>',process.env.NODE_ENV,process.cwd() );

export async function uploadImage(base64Image: string, type: string): Promise<string> {
  try {
    // If it's already a URL, return it
    if (!base64Image.startsWith('data:image')) {
      return base64Image;
    }

    // Convert base64 to buffer
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create unique filename with type prefix
    const uniqueId = crypto.randomUUID();
    const filename = `${type}-${uniqueId}.png`;
    const typeDir = path.join(UPLOAD_DIR, type);
    const filepath = path.join(typeDir, filename);

    // Ensure directories exist
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(typeDir, { recursive: true });

    // Write the file
    await fs.writeFile(filepath, buffer);

    return `/uploads/${type}/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Görsel kaydedilirken bir hata oluştu');
  }
}

export async function deleteImage(imageUrl: string | null, type: string) {
  if (!imageUrl) return;
  
  try {
    // Handle both local and external URLs
    if (imageUrl.startsWith('http')) {
      return; // Skip deletion for external URLs
    }

    // Extract filename from URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    const filePath = path.join(UPLOAD_DIR, type, fileName);
    
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (error) {
      // File doesn't exist or can't be accessed, which is fine
      console.log('File not found or already deleted:', filePath);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
} 