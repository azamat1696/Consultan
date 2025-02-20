"use server"
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, password: string, name: string) {
  try {
    await transporter.sendMail({
      from: `"Advicemy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Şifreniz Yenilendi",
      html: `
        <div>
          <h2>Merhaba ${name},</h2>
          <p>Yeni şifreniz: <strong>${password}</strong></p>
          <p>Güvenliğiniz için lütfen giriş yaptıktan sonra şifrenizi değiştirin.</p>
          <br/>
          <p>Saygılarımızla,</p>
          <p>Advicemy Ekibi</p>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendNewConsultantNotification(adminEmail: string, consultant: { email: string, id: number }) {
  try {
    await transporter.sendMail({
      from: `"Advicemy" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: "Yeni Danışman Kaydı",
      html: `
        <div>
          <h2>Yeni Danışman Kaydı</h2>
          <p>Yeni bir danışman kaydı oluşturuldu.</p>
          <p>Danışman Email: ${consultant.email}</p>
          <p>Danışman ID: ${consultant.id}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users/${consultant.id}">Danışman Profilini Görüntüle</a>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
} 

export async function sendAppointmentEmails(appointment: any, consultant: any, client: any) {
  const appointmentDate = new Date(appointment.date_time)
  const formattedDate = appointmentDate.toLocaleDateString('tr-TR')

  // Client email
  await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: client.email,
      subject: 'Randevunuz Onaylandı',
      html: `
          <h2>Merhaba ${client.name},</h2>
          <p>Randevunuz başarıyla oluşturuldu.</p>
          <h3>Randevu Detayları:</h3>
          <ul>
              <li>Danışman: ${consultant.name} ${consultant.surname}</li>
              <li>Tarih: ${formattedDate}</li>
              <li>Saat: ${appointment.appointment_time}</li>
          </ul>
          <p>Görüşme öncesi hatırlatma alacaksınız.</p>
      `
  })

  // Consultant email
  await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: consultant.email,
      subject: 'Yeni Randevu',
      html: `
          <h2>Merhaba ${consultant.name},</h2>
          <p>Yeni bir randevunuz var.</p>
          <h3>Randevu Detayları:</h3>
          <ul>
              <li>Danışan: ${client.name} ${client.surname}</li>
              <li>Email: ${client.email}</li>
              <li>Telefon: ${client.phone}</li>
              <li>Tarih: ${formattedDate}</li>
              <li>Saat: ${appointment.appointment_time}</li>
          </ul>
      `
  })
} 