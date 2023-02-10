import nodemailer from "nodemailer";
import { Mailer, SendMailArgs } from "./Mailer";

export class NodeMailer implements Mailer {
  send(args: SendMailArgs) {
    const transporter = nodemailer.createTransport({
      host: process.env.NX_SMTP_SERVER || "smtp.gmail.com",
      port: process.env.NX_SMTP_PORT || 587,
      auth: {
        user: process.env.NX_SMTP_USER,
        pass: process.env.NX_SMTP_PASS,
      },
    });
    // transporter.verify().then(console.log).catch(console.error);

    transporter.sendMail(args);
  }
}
