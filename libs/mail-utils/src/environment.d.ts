declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NX_SMTP_SERVER: string;
      NODE_ENV: "development" | "production" | "test";
      NX_SMTP_PASS: string;
      NX_SMTP_PORT: string;
      NX_SMTP_USER: string;
      USAR_COD_CENCO: string;
    }
  }
}

export {};
