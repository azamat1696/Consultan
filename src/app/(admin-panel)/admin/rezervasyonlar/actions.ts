"use server"

import prisma from "@/lib/db"
import { AppointmentStatus, Appointment, Packet } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

type AppointmentWithRelations = {
  appointment_id: number;
  date_time: Date;
  appointment_time: string | null;
  packet_id: number;
  consultant_id: number;
  client_id: number;
  status: AppointmentStatus | null;
  amount: Decimal | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  consultant: {
    name: string | null;
    surname: string | null;
  };
  client: {
    name: string | null;
    surname: string | null;
    email: string | null;
    phone: string | null;
  };
  packet: {
    packet_title: string | null;
    price: Decimal;
  };
}

export async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        consultant: {
          select: {
            name: true,
            surname: true,
          },
        },
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
    }) as AppointmentWithRelations[]

    // Convert Decimal values to regular numbers
    const serializedAppointments = appointments.map(appointment => ({
      ...appointment,
      amount: appointment.amount ? Number(appointment.amount) : null,
      packet: appointment.packet ? {
        ...appointment.packet,
        price: appointment.packet.price ? Number(appointment.packet.price) : null
      } : null
    }))

    return {
      success: true,
      data: serializedAppointments,
    }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return {
      success: false,
      error: "Rezervasyonlar yüklenirken bir hata oluştu",
    }
  }
}

export async function updateAppointmentStatus(appointmentId: number, status: AppointmentStatus) {
  try {
    console.log('Updating appointment:', { appointmentId, status });
    
    // First check if the appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        appointment_id: appointmentId
      }
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Rezervasyon bulunamadı'
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

    console.log('Update successful:', appointment);
    return {
      success: true,
      data: {
        ...appointment,
        amount: appointment.amount ? Number(appointment.amount) : null,
      }
    };
  } catch (error: any) {
    console.error('Error updating appointment status:', error?.message || 'Unknown error');
    return {
      success: false,
      error: error?.message || 'Durum güncellenirken bir hata oluştu'
    };
  }
} 