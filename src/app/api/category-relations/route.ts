import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { categoryId, expertises, workspaces } = await req.json();
    
    // Create relationships for each combination
    const relations = [];
    for (const expertiseId of expertises) {
      for (const workspaceId of workspaces) {
        relations.push({
          categoryId,
          expertiseId,
          workspaceId
        });
      }
    }

    // Create all relationships in a single transaction
    await prisma.$transaction(
      relations.map(relation => 
        prisma.categoryExpertiseWorkspaceConsultant.create({
          data: relation
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating relations:', error);
    return NextResponse.json(
      { error: "İlişkiler oluşturulurken hata oluştu" },
      { status: 500 }
    );
  }
} 