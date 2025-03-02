import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;
  const filePath = path.join('/home/azamat/actions-runner/_work/Consultan/Consultan/public', filename as string);

  try {
    const file = await fs.readFile(filePath);
    res.setHeader('Content-Type', 'image/*'); // Adjust the MIME type as needed
    res.send(file);
  } catch (error) {
    res.status(404).json({ message: 'File not found' });
  }
}