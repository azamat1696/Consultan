"use server"
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type LogData = {
  type: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "ERROR";
  action: string;
  description?: string;
};

export async function createLog(data: LogData) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";
    const session = await auth();

    await prisma.log.create({
      data: {
        userId: session?.user?.id,
        type: data.type,
        action: data.action,
        description: data.description,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Error creating log:", error);
  }
} 