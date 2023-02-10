import { randomEmail, randomCseg } from "@flash-ws/shared";
import { randomBytes } from "crypto";
import { dataSource } from "../../lib/data-source";
import {
  MotivoPermiso,
  PermisoUsarEmail,
} from "../../lib/entity/auth/permiso-usar-email.entity";
import { SolicitudAutenticarEmail } from "../../lib/entity/auth/solicitud-autenticar-email.entity";
import { SolicitudRegistro } from "../../lib/entity/auth/solicitud-registro.entity";

export const fakeToken = () => randomBytes(6).toString("hex");

export async function crearPermisoFake(
  email?: string
): Promise<[string, string]> {
  const token = randomBytes(6).toString("hex");
  email = email || randomEmail();
  const repo = dataSource.getRepository(PermisoUsarEmail);
  await repo.save(
    repo.create({ token, email, motivo: MotivoPermiso.RECUPERAR_PASSWORD })
  );
  return [email, token];
}

export const s: Partial<SolicitudRegistro> = {
  identLegal: "volcan",
  empresa: "volcan",
  nombre: "volcan",
  email: "volcan",
  password: "volcan",
  cseg: 123456,
};

export class SolicitudBuilder {
  withPendiente(pendiente: boolean) {
    this.pendiente = pendiente;
    return this;
  }
  email: string = randomEmail();
  pendiente = true;
  cseg = 123456;
  withEmail(email: string) {
    this.email = email;
    return this;
  }
  withCodigoSeguridad(cseg: number) {
    this.cseg = cseg;
    return this;
  }
  async build() {
    const repo = dataSource.getRepository(SolicitudRegistro);
    await repo.save(
      repo.create({
        ...s,
        email: this.email,
        pendiente: this.pendiente,
        cseg: this.cseg,
      })
    );
  }
}

export async function creaSolicitudAutenticar(): Promise<SolicitudAutenticarEmail> {
  const repo = dataSource.getRepository(SolicitudAutenticarEmail);
  return repo.save(repo.create({ email: randomEmail(), cseg: randomCseg() }));
}
