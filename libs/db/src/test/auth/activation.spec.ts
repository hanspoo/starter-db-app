import { SolicitudBuilder } from "./auth-test-utils";
import { inicializarSistema } from "../../lib/inicializarSistema";
import { CrearUsuarioService } from "../../lib/auth/CrearUsuarioService";
import { FinderSolicitudesRegistro } from "../../lib/auth/FinderSolicitudesRegistro";
import { randomCseg, randomEmail } from "@flash-ws/shared";

beforeAll(async () => {
  await inicializarSistema();
});

describe("activacion", () => {
  describe("servicio búsqueda solicitudes", () => {
    it("email inexistente cero solicitudes", async () => {
      const s = new FinderSolicitudesRegistro();
      const solicitudes = await s.solicitudesPendientes(randomEmail(), 123456);
      expect(solicitudes.length).toBe(0);
    });
    it("email existente da solicitud", async () => {
      const s = new FinderSolicitudesRegistro();

      const email = randomEmail();
      await new SolicitudBuilder().withEmail(email).build();
      const solicitudes = await s.solicitudesPendientes(email, 123456);
      expect(solicitudes.length).toBe(1);
    });
    it("sólo debe incluir solicitudes pendientes", async () => {
      const s = new FinderSolicitudesRegistro();

      const email = randomEmail();
      await new SolicitudBuilder()
        .withEmail(email)
        .withPendiente(false)
        .build();
      const solicitudes = await s.solicitudesPendientes(email, 123456);
      expect(solicitudes.length).toBe(0);
    });
    it("buscar el código de seguridad", async () => {
      const s = new FinderSolicitudesRegistro();

      const email = randomEmail();
      await new SolicitudBuilder()
        .withEmail(email)
        .withCodigoSeguridad(123456)
        .withPendiente(true)
        .build();
      const solicitudes = await s.solicitudesPendientes(email, 123456);
      expect(solicitudes.find((s) => s.cseg === 123456)).toBeTruthy();
    });
    it("no debe encontrar con código seguridad inválido", async () => {
      const s = new FinderSolicitudesRegistro();

      const email = randomEmail();
      await new SolicitudBuilder()
        .withEmail(email)
        .withCodigoSeguridad(123456)
        .withPendiente(true)
        .build();
      const solicitudes = await s.solicitudesPendientes(email, 123456);
      expect(solicitudes.find((s) => s.cseg === 567890)).toBeFalsy();
    });
    it("método consolidado", async () => {
      const s = new FinderSolicitudesRegistro();

      const email = randomEmail();
      await new SolicitudBuilder()
        .withEmail(email)
        .withCodigoSeguridad(123456)
        .withPendiente(true)
        .build();
      const solicitudes = await s.solicitudesPendientes(email, 123456);
      expect(solicitudes.find((s) => s.cseg === 123456)).toBeTruthy();
    });
  });
  describe("servicio integrado", () => {
    it("sin solicitud creada, debe dar error de email", async () => {
      const s = new FinderSolicitudesRegistro();
      const response = await s.execute("info@myapp.com", 123456);
      expect(response.success).toBe(false);
      expect(response.msg).toContain("REG001");
    });
    it("solicitud con email, cseg incorrecto da error", async () => {
      const s = new FinderSolicitudesRegistro();
      const email = randomEmail();
      await new SolicitudBuilder().withEmail(email).build();

      const response = await s.execute(email, randomCseg());
      expect(response.success).toBe(false);
      expect(response.msg).toContain("REG002");
    });
    it("solicitud todo correcto, crea solicitud", async () => {
      const s = new FinderSolicitudesRegistro();
      const email = randomEmail();
      const cseg = randomCseg();
      await new SolicitudBuilder()
        .withEmail(email)
        .withCodigoSeguridad(cseg)
        .build();

      const response = await s.execute(email, cseg);
      expect(response.success).toBe(true);
      if (!response.solicitud)
        throw Error("response.solicitud debe estar definida");
      expect(response.solicitud.email).toContain(email);
    });
    it("crear usuario desde solicitud", async () => {
      const s = new FinderSolicitudesRegistro();
      const email = randomEmail();
      const cseg = randomCseg();
      await new SolicitudBuilder()
        .withEmail(email)
        .withCodigoSeguridad(cseg)
        .build();

      const response = await s.execute(email, cseg);
      const scu = new CrearUsuarioService();
      if (!response.solicitud)
        throw Error("response.solicitud debe estar definida");
      const e = await scu.crearDesdeSolicitud(response.solicitud);

      expect(e.usuarios[0].email).toBe(email);
    });
  });
});
