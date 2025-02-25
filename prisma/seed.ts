import { PrismaClient, Gender } from '@prisma/client'
import { hashPassword } from '../src/lib/password'

const prisma = new PrismaClient()

async function main() {
  // Check if admin exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: "admin@example.com",
      role: "admin"
    }
  })

  if (!existingAdmin) {
    // Create admin user if doesn't exist
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
    console.log('Admin user created:', adminUser.email)
  } else {
    console.log('Admin user already exists')
  }
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 