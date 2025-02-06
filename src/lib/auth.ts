import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function auth() {
  const session = await getServerSession(authOptions as any);
  return session;
}

export async function checkSessionVersion(token: any) {
  const dbUser = await prisma.user.findUnique({
    where: { id: token.id },
    select: { sessionVersion: true }
  });

  if (dbUser && dbUser.sessionVersion !== token.sessionVersion) {
    return null; // This will force a new sign in
  }

  return token;
} 