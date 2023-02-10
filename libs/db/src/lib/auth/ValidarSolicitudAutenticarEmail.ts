import { randomBytes } from "crypto";
import { dataSource } from "../data-source";
import { SolicitudAutenticarEmail } from "../entity/auth/solicitud-autenticar-email.entity";
import {
  MotivoPermiso,
  PermisoUsarEmail,
} from "../entity/auth/permiso-usar-email.entity";

export type ValidaSolicitudAutenticarEmailResponse = {
  success: boolean;
  msg: string;
  permiso?: PermisoUsarEmail;
};

export class ValidarSolicitudAutenticarEmail {
  async execute(
    email: string,
    cseg: number,
    motivo: MotivoPermiso
  ): Promise<ValidaSolicitudAutenticarEmailResponse> {
    const repoSol = dataSource.getRepository(SolicitudAutenticarEmail);
    const repoPermiso = dataSource.getRepository(PermisoUsarEmail);
    const solicitud = await repoSol.findOne({
      where: { email, cseg, vigente: true },
    });
    if (solicitud && solicitud.created_at > ahoraMenos5()) {
      await repoSol.save({ ...solicitud, vigente: false });
      const token = genRandomToken();
      const permiso = await repoPermiso.save(
        repoPermiso.create({
          token,
          email,
          motivo,
        })
      );

      return { success: true, msg: "Ok", permiso };
    } else {
      return { success: false, msg: "VS0001" };
    }
  }
}
function genRandomToken() {
  return randomBytes(32).toString("base64");
}
function ahoraMenos5(): number {
  const d = new Date();
  return d.setMinutes(
    d.getMinutes() - SolicitudAutenticarEmail.vigenciaMinutos()
  );
}
