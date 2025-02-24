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

  const consultant = await prisma.user.create({
    data: {
      name: "Ayşe",
      surname: "Yılmaz",
      email: "ayse@example.com",
      password: await hashPassword("123456"),
      role: "consultant",
      gender: Gender.female,
      title: "Uzman Psikolog",
      phone: "905559876543",
      status: true,
      slug: "ayse-yilmaz",
      description: "15 yıllık deneyimli psikolog"
    }
  })

  // Create Education
  await prisma.education.create({
    data: {
      university_name: "İstanbul Üniversitesi",
      educational_degree: "Yüksek Lisans",
      department: "Klinik Psikoloji",
      start_date: new Date("2010-09-01"),
      end_date: new Date("2012-06-30"),
      status: true,
      consultant_id: consultant.id
    }
  })

  // Create Certificate
  await prisma.certificate.create({
    data: {
      certificate_name: "Bilişsel Davranışçı Terapi Sertifikası",
      issuing_organization: "Türk Psikologlar Derneği",
      given_date: new Date("2015-03-15"),
      status: true,
      consultant_id: consultant.id
    }
  })

  // Create Expertise
  const expertise = await prisma.expertise.create({
    data: {
      name: "Depresyon Terapisi",
      status: true,
      slug: "depresyon-terapisi"
    }
  })

  // Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Online Terapi",
      status: true,
      slug: "online-terapi"
    }
  })

  // Create ConsultantExpertiseLink
  await prisma.consultantExpertiseLink.create({
    data: {
      consultant_id: consultant.id,
      expertise_id: expertise.id,
      workspaces: JSON.stringify([{ id: 1, name: "Online Terapi" }])
    }
  })

  // Create Packet
  await prisma.packet.create({
    data: {
      packet_type: PacketType.PACKAGE,
      packet_title: "4 Seanslık Paket",
      packet_minutes: 45,
      meeting_times: 4,
      price: 1000,
      discounted_price: 800,
      meeting_description: "Haftalık online terapi seansları",
      status: true,
      consultant_id: consultant.id
    }
  })

  // Create Menu
  const menu = await prisma.menu.create({
    data: {
      title: "Psikolojik Danışmanlık",
      type: MenuType.DropDown,
      slug: "psikolojik-danismanlik",
      order_number: 1
    }
  })

  // Create Category
  await prisma.category.create({
    data: {
      menuId: menu.id,
      title: "Bireysel Terapi",
      slug: "bireysel-terapi",
      image: "/images/therapy.jpg"
    }
  })

  // Create Slider
  await prisma.slider.create({
    data: {
      title: "Online Psikolojik Danışmanlık",
      description: "Uzman psikologlarımızla online terapi seansları",
      image: "/images/slider1.jpg",
      status: true
    }
  })

  // Create Log
  await prisma.log.create({
    data: {
      userId: adminUser.id,
      type: LogType.CREATE,
      action: "Kullanıcı Oluşturma",
      description: "Yeni danışman hesabı oluşturuldu",
      ip: "127.0.0.1",
      userAgent: "Seed Script"
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