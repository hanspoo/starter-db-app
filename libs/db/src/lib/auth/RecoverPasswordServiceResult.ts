import { SolicitudAutenticarEmail } from "../entity/auth/solicitud-autenticar-email.entity";

export type RecoverPasswordServiceResult = {
  success: boolean;
  msg: string;
  solicitud?: SolicitudAutenticarEmail;
};
