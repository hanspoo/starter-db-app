import { SolicitudRegistro } from '../entity/auth/solicitud-registro.entity';

export type ActivationServiceResponse = {
  success?: boolean;
  msg: string;
  solicitud?: SolicitudRegistro;
};
