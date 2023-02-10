import nodemailer from "nodemailer";
export function cleanupEmail(email: string) {
  if (!email) {
    console.log("Se ha llamado a validar email sin email");
    return "";
  }
  if (typeof email !== "string") {
    console.log("El email entragado para validar no es string");
    return "";
  }
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  if (!email) {
    console.log("Se ha llamado a validar email sin email");
    return false;
  }
  if (typeof email !== "string") {
    console.log("El email entragado para validar no es string");
    return false;
  }
  if (email.indexOf(" ") !== -1) return false;
  return /\w+@\w+\.\w+/.test(email);
}

export function mailer() {
  return nodemailer.createTransport({
    host: process.env.NX_SMTP_SERVER || "smtp.gmail.com",
    port: process.env.NX_SMTP_PORT || 587,
    auth: {
      user: process.env.NX_SMTP_USER,
      pass: process.env.NX_SMTP_PASS,
    },
  });
}
