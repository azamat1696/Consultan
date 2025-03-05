'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUpload: (filePath: string) => void;
  type: string;
  currentImage?: string | null;
  label?: string;
  className?: string;
}

export default function FileUpload({
  onUpload,
  type,
  currentImage,
  label = 'Upload Image',
  className = '',
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (8MB limit)
    if (file.size > 8 * 1024 * 1024) {
      toast.error('File size must be less than 8MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUpload(data.filePath);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isUploading && (
          <div className="text-sm text-gray-500">Uploading...</div>
        )}
      </div>
      {preview && (
        <div className="relative w-full h-40 mt-2">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain rounded-lg"
            unoptimized={preview.startsWith('data:')}
          />
        </div>
      )}
    </div>
  );
} 