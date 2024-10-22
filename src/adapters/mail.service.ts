import nodemailer, { TransportOptions } from "nodemailer";
import { RegistrationInputModel } from "../features/auth/models/auth.models";

export const nodemailerService = {
  async sendLetter(payload: RegistrationInputModel): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: payload.email,
      subject: "Account activation at " + process.env.CLIENT_URL,
      html: `
        <h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
        </p>
        `,
    };
    await transporter.sendMail(mailOptions);
  },
};
