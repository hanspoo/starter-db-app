export interface SendMailArgs {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface Mailer {
  send(args: SendMailArgs): void;
}
