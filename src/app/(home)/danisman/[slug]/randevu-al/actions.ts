'use server' // TODO: Remove this ödeme sitemini test et
import prisma from '@/lib/db'
import { getSlug } from '@/lib/utils'
import { stripe } from '@/lib/stripe'
import { sendAppointmentEmails } from '@/lib/mail'

interface AppointmentData {
    consultant_id: number
    packet_id: number
    appointment_date: Date
    appointment_time: string
    firstName: string
    lastName: string
    email: string
    phone: string
    amount: number
    notes?: string
}

interface WeeklySchedule {
    schedule: {
        dayId: number;
        hours: string[];
        dayName: string;
    }[];
    appointmentBuffer: string;
}

export async function createAppointment(data: AppointmentData) {
    console.log('data',data)
    try {
        // Check if client exists
        const clientExists = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        let client = null
        if (!clientExists) {
            // First find the client
            client = await prisma.user.upsert({
                where: {
                email: data.email
            },
            update: {
                name: data.firstName,
                surname: data.lastName,
                phone: data.phone
            },
            create: {
                name: data.firstName,
                surname: data.lastName,
                email: data.email,
                phone: data.phone,
                status: true,
                role: 'client',
                slug: getSlug(data.firstName + " " + data.lastName)
            }
            })
        }

        // Get consultant data
        const consultant = await prisma.user.findUnique({
            where: { id: data.consultant_id }
        })

        if (!consultant) {
            throw new Error('Consultant not found')
        }

        const clientId = clientExists?.id || client?.id;
        if (!clientId) {
            throw new Error('Client ID not found');
        }

        // Format the date properly
        const appointmentDate = new Date(data.appointment_date)
        appointmentDate.setHours(0, 0, 0, 0)

        // Create the appointment
        const appointment = await prisma.appointment.create({
            data: {
                consultant_id: data.consultant_id,
                client_id: clientId,
                packet_id: data.packet_id,
                date_time: appointmentDate,
                appointment_time: data.appointment_time,
                status: 'pending',
                amount: data.amount
            }
        })

        // Send confirmation emails
        await sendAppointmentEmails(appointment, consultant, client)

        return { success: true, data: appointment }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating appointment:', error.message)
            return { success: false, error: error.message }
        }
        return { success: false, error: 'Failed to create appointment' }
    }
}

export async function getConsultantCalendar(consultantId: number, date: string) {
    try {
        const weeklyCalendar = await prisma.weeklyCalendar.findFirst({
            where: {
                consultant_id: consultantId,
                status: true,
                deletedAt: null
            }
        })
        if (!weeklyCalendar?.day_and_hours) {
            return { success: false, error: 'No calendar found' }
        }

        // Get the day of week (1-7, where 1 is Monday and 7 is Sunday)
        const selectedDate = new Date(date)
        const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay()
        // Parse the JSON calendar data
        const calendar:any = weeklyCalendar.day_and_hours;
        // Find the schedule for the selected day
        const daySchedule:any = calendar.schedule.find((day:any) => day.dayId === dayOfWeek)
        if (!daySchedule) {
            return { 
                success: true, 
                data: [],
                message: `${selectedDate.toLocaleDateString('tr-TR')} tarihinde müsait saat bulunmamaktadır.`
            }
        }
        // Get existing appointments for the selected date
        const appointments = await prisma.appointment.findMany({
            where: {
                consultant_id: consultantId,
                date_time: {
                    equals: new Date(date)
                }
            }
        })
        // Filter out booked times from available slots
        const availableSlots = daySchedule.hours.filter((time:any) => 
            !appointments.some((apt:any) => apt.date_time === time)
        )
        console.log("availableSlots",availableSlots)
        // Get current time
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const selectedDateObj = new Date(date)

        // If the selected date is today, filter out past times
        if (selectedDateObj.getTime() === today.getTime()) {
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()
            const bufferHours = parseInt(calendar.appointmentBuffer) || 6

            return {
                success: true,
                data: availableSlots.filter((time:any) => {
                    const [hours, minutes] = time.split(':').map(Number)
                    if (hours > currentHour + bufferHours) return true
                    if (hours === currentHour + bufferHours && minutes > currentMinute) return true
                    return false
                }),
                dayName: daySchedule.dayName
            }
        }

        return {
            success: true,
            data: availableSlots,
            dayName: daySchedule.dayName
        }
    } catch (error) {
        console.error('Error fetching calendar:', error)
        return { success: false, error: 'Failed to fetch calendar' }
    }
}

export async function createCheckoutSession(appointmentData: AppointmentData, packet: any) {
    console.log('appointmentData',appointmentData)
    console.log('packet',packet)
    return;
    try {
        // Check if payments are enabled
        if (process.env.ENABLE_PAYMENTS === 'false') {
            // Create appointment directly without payment
            const result = await createAppointment(appointmentData)
            return { 
                success: true, 
                skipPayment: true,
                appointmentResult: result 
            }
        }

        // Normal payment flow
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'try',
                        product_data: {
                            name: `${packet.packet_type} - ${packet.meeting_times} Görüşme`,
                            description: `${appointmentData.appointment_time} tarihli görüşme`,
                        },
                        unit_amount: packet.price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/danisman/${appointmentData.consultant_id}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/danisman/${appointmentData.consultant_id}`,
            metadata: {
                appointmentData: JSON.stringify(appointmentData),
            },
        });

        return { success: true, url: session.url };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return { success: false, error: 'Payment session creation failed' };
    }
} 