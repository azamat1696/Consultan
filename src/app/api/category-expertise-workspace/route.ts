import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const result = await prisma.categoryExpertiseWorkspaceConsultant.create({
      data: {
        categoryId: data.categoryId,
        expertiseId: data.expertiseId,
        workspaceId: data.workspaceId,
        consultantId: data.consultantId
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "İşlem başarısız" },
      { status: 500 }
    );
  }
} 