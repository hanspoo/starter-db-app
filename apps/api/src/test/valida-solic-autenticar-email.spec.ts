import { RequestValidaCodSeguridad } from "@flash-ws/api-interfaces";
import {
  dataSource,
  inicializarSistema,
  SolicitudAutenticarEmail,
} from "@flash-ws/db";
import request from "supertest";
import { app } from "../app";
import { randomEmail, randomCseg } from "@flash-ws/shared";

const repoSol = dataSource.getRepository(SolicitudAutenticarEmail);

beforeAll(async () => {
  await inicializarSistema();
});

describe("valida código recuperar contraseña", () => {
  it("sin argumentos debe dar un 400", async () => {
    const response = await request(app)
      .post("/api/auth/valida-cod-seguridad")
      .send({});
    expect(response.status).toBe(400);
  });
  it("con email y codigo de seguridad inválidos debe dar 400", async () => {
    const cseg = 123456;
    const email = "xxx@xx.com";
    const invalidData: RequestValidaCodSeguridad = {
      cseg,
      email,
    };

    const response = await request(app)
      .post("/api/auth/valida-cod-seguridad")
      .send(invalidData);
    expect(response.status).toBe(400);
  });
  it("con email y codigo de seguridad válidos da 200", async () => {
    const [email, cseg] = await crearSolicitud();
    const response = await request(app)
      .post("/api/auth/valida-cod-seguridad")
      .send({ email, cseg });
    expect(response.status).toBe(200);
  });
  it("los permisos expiran en 10 minutos", async () => {
    const email = randomEmail();
    const cseg = randomCseg();
    const d = new Date();
    const created_at = d.setMinutes(d.getMinutes() - 10);
    await repoSol.save(repoSol.create({ email, cseg, created_at }));

    const response = await request(app)
      .post("/api/auth/valida-cod-seguridad")
      .send({ email, cseg });
    expect(response.status).toBe(400);
  });
});

async function crearSolicitud(): Promise<[string, number]> {
  const email = randomEmail();
  const cseg = randomCseg();
  await repoSol.save(repoSol.create({ email, cseg }));
  return [email, cseg];
}
