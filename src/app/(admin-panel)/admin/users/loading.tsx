"use client"
import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
        <Spinner size="md" color="primary" />
        <span className="text-gray-700">Yükleniyor...</span>
      </div>
    </div>
  );
} 