// dado un código de seguridad, genera un token asociado al email
// para realizar la operación.

import { inicializarSistema } from "../../lib/inicializarSistema";
import {
  ValidarSolicitudAutenticarEmail,
  ValidaSolicitudAutenticarEmailResponse,
} from "../../lib/auth/ValidarSolicitudAutenticarEmail";
import { randomCseg, randomEmail } from "@flash-ws/shared";
import { creaSolicitudAutenticar } from "./auth-test-utils";
import { MotivoPermiso } from "../../lib/entity/auth/permiso-usar-email.entity";

beforeAll(async () => {
  await inicializarSistema();
});

describe("valida código de seguridad", () => {
  it("email y código inválido envia error", async () => {
    const s = new ValidarSolicitudAutenticarEmail();
    const resultado: ValidaSolicitudAutenticarEmailResponse = await s.execute(
      randomEmail(),
      randomCseg(),
      MotivoPermiso.RECUPERAR_PASSWORD
    );

    expect(resultado.success).toBe(false);
    expect(resultado.permiso).toBeFalsy();
  });
  it("email y código válido, envia token", async () => {
    const sol = await creaSolicitudAutenticar();
    const servicio = new ValidarSolicitudAutenticarEmail();
    const resultado: ValidaSolicitudAutenticarEmailResponse =
      await servicio.execute(
        sol.email,
        sol.cseg,
        MotivoPermiso.RECUPERAR_PASSWORD
      );

    expect(resultado.success).toBe(true);
    expect(resultado.permiso).toBeTruthy();
    expect(resultado.permiso?.token).toBeTruthy();
  });
  it("email ok y código error, da error", async () => {
    const sol = await creaSolicitudAutenticar();
    const servicio = new ValidarSolicitudAutenticarEmail();
    const resultado: ValidaSolicitudAutenticarEmailResponse =
      await servicio.execute(
        sol.email,
        999999,
        MotivoPermiso.RECUPERAR_PASSWORD
      );

    expect(resultado.success).toBe(false);
    expect(resultado.permiso).toBeFalsy();
  });
});
