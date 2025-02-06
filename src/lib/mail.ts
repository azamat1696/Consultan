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