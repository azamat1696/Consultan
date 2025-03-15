"use server"
import nodemailer from "nodemailer";
import prisma from "./db";
import { createHash } from "crypto";

// transporter'ı fonksiyon içinde oluşturalım
async function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendPasswordResetEmail(email: string, password: string, name: string) {
  try {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: `"Dancomy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Şifreniz Yenilendi",
      html: `
        <div>
          <h2>Merhaba ${name},</h2>
          <p>Yeni şifreniz: <strong>${password}</strong></p>
          <p>Güvenliğiniz için lütfen giriş yaptıktan sonra şifrenizi değiştirin.</p>
          <br/>
          <p>Saygılarımızla,</p>
          <p>Dancomy Ekibi</p>
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
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: `"Dancomy" <${process.env.SMTP_USER}>`,
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
  try {
    const transporter = await createTransporter();
    const appointmentDate = new Date(appointment.date_time);
    const formattedDate = appointmentDate.toLocaleDateString('tr-TR');

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
        <p>Saygılarımızla,<br>Dancomy Ekibi</p>
      `
    });

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
        <p>Saygılarımızla,<br>Dancomy Ekibi</p>
      `
    });
  } catch (error) {
    console.error("Error sending appointment emails:", error);
    throw error;
  }
}

export async function sendPasswordResetEmailLink(email: string) {
  try {
    const transporter = await createTransporter();
    // Kullanıcıyı kontrol et
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error("Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı");
    }

    // Benzersiz bir token oluştur
    const resetToken = createHash('sha256')
      .update(Math.random().toString())
      .digest('hex');
    
    // Token'ın geçerlilik süresini 1 saat olarak ayarla
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 saat

    // Token'ı veritabanına kaydet
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Reset URL'ini oluştur
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sifre-sifirla/${resetToken}`;

    // E-posta içeriği
    const emailContent = `
      <h1>Şifre Sıfırlama İsteği</h1>
      <p>Merhaba,</p>
      <p>Hesabınız için bir şifre sıfırlama isteği aldık. Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Şifremi Sıfırla</a>
      <p>Bu bağlantı 1 saat süreyle geçerlidir.</p>
      <p>Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      <p>Saygılarımızla,<br>Dancomy.com</p>
    `;

    // E-postayı gönder
    await transporter.sendMail({
      from: `"Dancomy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Şifre Sıfırlama İsteği",
      html: emailContent
    });

  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: `"Dancomy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Dancomy'ye Hoş Geldiniz!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #35303E; text-align: center;">Dancomy'ye Hoş Geldiniz!</h1>
          <p>Merhaba,</p>
          <p>Dancomy ailesine katıldığınız için teşekkür ederiz! Artık siz de uzman danışmanlarımızla görüşme yapabilir, profesyonel destek alabilirsiniz.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #35303E; margin-top: 0;">Başlamak için:</h3>
            <ul style="padding-left: 20px;">
              <li>Profilinizi tamamlayın</li>
              <li>Uzmanlarımızı inceleyin</li>
              <li>Size en uygun danışmanı seçin</li>
              <li>Hemen randevu alın</li>
            </ul>
          </div>

          <p>Herhangi bir sorunuz olursa, destek ekibimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/signin" 
               style="background-color: #35303E; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
              Hemen Başla
            </a>
          </div>

          <p style="margin-top: 30px;">Saygılarımızla,<br>Dancomy Ekibi</p>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
} 