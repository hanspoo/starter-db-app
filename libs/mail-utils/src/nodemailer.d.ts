declare module "nodemailer" {
  function createTransport(arg0: {
    host: string;
    port: string | number;
    auth: { user: string; pass: string };
  }): any;
}
