import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const UPLOAD_DIR = process.env.NODE_ENV === 'development'
  ? path.join(process.cwd(), 'public', 'uploads') // Save to public/uploads in development
  : '/var/www/uploads';
  console.log('>>>>>>>',UPLOAD_DIR );

export async function uploadImage(base64Image: string | { arrayBuffer: () => Promise<ArrayBuffer>, name: string }, type: string): Promise<string> {
   try {
    // If it's already a URL, return it
    if (typeof base64Image === 'string' && !base64Image.startsWith('data:image')) {
      return base64Image;
    }

    let buffer: Buffer;
    let extension = 'png';

    if (typeof base64Image === 'object' && 'arrayBuffer' in base64Image) {
      // Handle File-like object
      const arrayBuffer = await base64Image.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      extension = base64Image.name.split('.').pop() || 'png';
    } else {
      // Handle base64 string
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
      extension = base64Image.split(';')[0].split('/')[1];
    }

    // Create unique filename with type prefix
    const uniqueId = crypto.randomUUID();
    const filename = `${type}-${uniqueId}.${extension}`;
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

export async function deleteImage(imageUrl: string | null, type: string): Promise<void> {
    if (!imageUrl) return;

    try {
        // Extract filename from URL
        const fileName = path.basename(imageUrl);
        
        // Construct the full file path based on environment
        const filePath = path.join(UPLOAD_DIR, type, fileName);

        // Check if file exists before attempting to delete
        try {
            await fs.access(filePath);
        } catch (error) {
            console.log(`File ${filePath} does not exist or cannot be accessed`);
            return;
        }

        // Delete the file
        await fs.unlink(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
    } catch (error) {
        console.error('Error deleting image:', error);
        // Don't throw error to prevent blocking the update process
    }
} 