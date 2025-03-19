'use server'
import prisma from "@/lib/db"
import { AppointmentStatus } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface AppointmentWithRelations {
  appointment_id: number
  date_time: Date
  appointment_time: string | null
  amount: number | null
  status: AppointmentStatus | null
  createdAt: Date
  consultant_id: number
  client_id: number
  packet_id: number | null
  client: {
    name: string | null
    surname: string | null
    email: string | null
    phone: string | null
  }
  packet: {
    packet_title: string | null
    price: number | null
  } | null
}

export async function getConsultantAppointments() {
   
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Oturum açmanız gerekiyor"
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        consultant_id: Number(session.user.id)
      },
      include: {
        client: {
          select: { 
            name: true,
            surname: true,
            email: true,
            phone: true,
          },
        },
        packet: {
          select: {
            packet_title: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Convert Decimal values to regular numbers
    const serializedAppointments = appointments.map(appointment => ({
      ...appointment,
      amount: appointment.amount ? Number(appointment.amount) : null,
      packet: appointment.packet ? {
        ...appointment.packet,
        price: appointment.packet.price ? Number(appointment.packet.price) : null
      } : null
    })) as AppointmentWithRelations[]

    return {
      success: true,
      data: serializedAppointments,
    }
  } catch (error) {
    console.error("Error fetching consultant appointments:", error)
    return {
      success: false,
      error: "Randevular yüklenirken bir hata oluştu",
    }
  }
}

export async function updateAppointmentStatus(appointmentId: number, status: AppointmentStatus) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Oturum açmanız gerekiyor"
      }
    }

    // First check if the appointment exists and belongs to the consultant
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        appointment_id: appointmentId,
        consultant_id: Number(session.user.id)
      }
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Randevu bulunamadı veya bu randevuya erişim yetkiniz yok'
      };
    }

    // Ensure status is lowercase
    const normalizedStatus = status.toLowerCase() as AppointmentStatus;

    // Update the appointment status
    const appointment = await prisma.appointment.update({
      where: {
        appointment_id: appointmentId
      },
      data: {
        status: normalizedStatus
      }
    });

    // Serialize the response to convert Decimal to Number
    const serializedAppointment = {
      ...appointment,
      amount: appointment.amount ? Number(appointment.amount) : null,
    };

    return {
      success: true,
      data: serializedAppointment
    };
  } catch (error: any) {
    console.error('Error updating appointment status:', error?.message || 'Unknown error');
    return {
      success: false,
      error: error?.message || 'Durum güncellenirken bir hata oluştu'
    };
  }
}

export async function updateAppointmentNotes(appointmentId: number, notes: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return { success: false, error: "Oturum açmanız gerekiyor" }
    }

    const consultant = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!consultant) {
      return { success: false, error: "Danışman bulunamadı" }
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        appointment_id: appointmentId,
        consultant_id: consultant.id,
      },
    })

    if (!appointment) {
      return { success: false, error: "Randevu bulunamadı" }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { appointment_id: appointmentId },
      data: { notes },
    })

    return { success: true, data: updatedAppointment }
  } catch (error) {
    console.error("Error updating appointment notes:", error)
    return { success: false, error: "Notlar güncellenirken bir hata oluştu" }
  }
} 