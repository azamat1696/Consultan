import { PrismaClient, Gender, PacketType, AppointmentStatus, MenuType, LogType } from '@prisma/client'
import { hashPassword } from '../src/lib/password'

const prisma = new PrismaClient()

async function main() {
  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin",
      surname: "Kullanıcı",
      email: "admin@example.com",
      password: await hashPassword("123456"),
      role: "admin",
      gender: Gender.male,
      title: "Sistem Yöneticisi",
      phone: "905551234567",
      status: true,
      slug: "admin-kullanici"
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 