"use server"
import prisma from "@/lib/db";
import { createLog } from "./logger";

export async function softDelete(
  model: string, 
  id: number | bigint, 
  idField: string = 'id',
  description?: string
) {
  const modelAny = (prisma as any)[model.toLowerCase()];
  if (!modelAny) throw new Error(`Invalid model: ${model}`);

  try {
    await modelAny.update({
      where: { [idField]: id },
      data: { deletedAt: new Date() }
    });

    await createLog({
      type: "DELETE",
      action: `${model} Silme`,
      description: description || `${model} ID: ${id} silindi.`
    });

    return true;
  } catch (error) {
    await createLog({
      type: "ERROR",
      action: `${model} Silme Hatası`,
      description: error instanceof Error ? error.message : "Bilinmeyen hata"
    });
    throw error;
  }
} 