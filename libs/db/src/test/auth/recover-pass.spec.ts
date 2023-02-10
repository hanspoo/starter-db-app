// dado un email debe generar un registro de recuperación de contraseña y enviar un email

import { Mailer, SendMailArgs } from "@flash-ws/mail-utils";
import { RecoverPasswordService } from "../../lib/auth/RecoverPasswordService";
import { inicializarSistema } from "../../lib/inicializarSistema";
import { ValidarSolicitudAutenticarEmail } from "../../lib/auth/ValidarSolicitudAutenticarEmail";
import { randomCseg, randomEmail } from "@flash-ws/shared";
import { MotivoPermiso } from "../../lib/entity/auth/permiso-usar-email.entity";

beforeAll(async () => {
  await inicializarSistema();
});

class MockMailer implements Mailer {
  params: SendMailArgs;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(params: SendMailArgs): void {
    this.params = params;
  }
}
const email = "admin@myapp.com";

describe("recuperación de contraseña", () => {
  describe("mailer", () => {
    it("llama el mailer con parámetros", async () => {
      const s = new RecoverPasswordService(email);
      const mock = new MockMailer();
      s.mailer = mock;
      await s.execute();

      expect(mock.params.to).toBe(email);
    });
  });
  describe("solicitud", () => {
    it("debe generar y devolver el registro de recuperacion", async () => {
      const s = new RecoverPasswordService("admin@myapp.com");
      const mock = new MockMailer();
      s.mailer = mock;
      const solicRecup = await s.execute();

      expect(solicRecup).toBeTruthy();
    });
    it("debe establecer correctamente el correo de la solicitud", async () => {
      const email = "admin@myapp.com";
      const s = new RecoverPasswordService(email);
      const mock = new MockMailer();
      s.mailer = mock;
      const solicRecup = await s.execute();

      expect(solicRecup.solicitud?.email).toBe(email);
    });

    it("email inválido, mensaje 01", async () => {
      const s = new RecoverPasswordService("xxx");
      const mock = new MockMailer();
      s.mailer = mock;
      const solicRecup = await s.execute();

      expect(solicRecup.msg).toContain("RPA001");
    });
    it("si no existe email para el usuario enviar correo disuasivo", async () => {
      const email = randomEmail();
      const s = new RecoverPasswordService(email);
      const mock = new MockMailer();
      s.mailer = mock;
      const solicRecup = await s.execute();

      expect(solicRecup.msg).toContain("RPA002");
    });
  });
  describe("paso2 handler validar email y codigo", () => {
    describe("valida que el código ingresado corresponda a solicitud para el email", () => {
      it("con código inválido manda error 1", async () => {
        const service = new ValidarSolicitudAutenticarEmail();
        const response = await service.execute(
          randomEmail(),
          randomCseg(),
          MotivoPermiso.RECUPERAR_PASSWORD
        );
        expect(response.success).toBe(false);
      });
      it("con datos correctos responde success", async () => {
        const recoverPassService = new RecoverPasswordService(email);
        const mock = new MockMailer();
        recoverPassService.mailer = mock;
        const res1 = await recoverPassService.execute();
        const cseg = res1.solicitud!.cseg;

        const validarRecupService = new ValidarSolicitudAutenticarEmail();
        const response = await validarRecupService.execute(
          email,
          cseg,
          MotivoPermiso.RECUPERAR_PASSWORD
        );
        expect(response.success).toBe(true);
      });
    });
  });
});
