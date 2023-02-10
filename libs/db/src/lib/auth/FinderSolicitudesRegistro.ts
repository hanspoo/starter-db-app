import { dataSource } from '../data-source';
import { SolicitudRegistro } from '../entity/auth/solicitud-registro.entity';
import { ActivationServiceResponse } from './ActivationServiceResponse';

const repo = dataSource.getRepository(SolicitudRegistro);

export class FinderSolicitudesRegistro {
  async execute(
    email: string,
    cseg: number
  ): Promise<ActivationServiceResponse> {
    const solics = await repo.find({
      where: { email, pendiente: true },
      order: { updated_at: 'desc' },
    });
    let res: ActivationServiceResponse;
    if (solics.length === 0) {
      res = {
        msg: 'REG001, Email no está registrado',
        success: false,
      };
    } else {
      console.log('solics', solics);
      console.log('cseg', cseg);

      const solicitud = solics.find((s) => s.cseg === cseg);
      if (solicitud) {
        res = {
          msg: 'Ok',
          success: true,
          solicitud,
        };
      } else {
        res = {
          msg: 'REG002, Código de seguridad inválido',
          success: false,
        };
      }
    }
    return res;
  }
  solicitudesPendientes(
    email: string,
    cseg: number
  ): Promise<Array<SolicitudRegistro>> {
    return repo.find({
      where: { email, pendiente: true, cseg: cseg },
    });
  }
}
