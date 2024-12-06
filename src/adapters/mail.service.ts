import { injectable } from "inversify";
import nodemailer from "nodemailer";

type MailPurposeType = "activationAcc" | "recoveryPass";

@injectable()
export class NodemailerService {
  async sendLetter(email: string, confirmationCode: string, purpose: MailPurposeType): Promise<void> {
    const isActivation = purpose === "activationAcc";

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

    const subject = isActivation ? "Account activation at " + process.env.CLIENT_URL : "Recovery Password at " + process.env.CLIENT_URL;
    const htmlText = isActivation
      ? `
        <h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>
        `
      : `
        <h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='https://somesite.com/password-recovery?recoveryCode=${confirmationCode}'>recovery password</a>
        </p>
        `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      html: htmlText,
    };
    await transporter.sendMail(mailOptions);
  }
}
