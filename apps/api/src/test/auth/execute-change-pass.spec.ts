// import nodemailer from "nodemailer";
import { ExecuteChangePassRequest } from "@flash-ws/api-interfaces";
import {
  dataSource,
  inicializarSistema,
  MotivoPermiso,
  PermisoUsarEmail,
} from "@flash-ws/db";
import { randomEmail } from "@flash-ws/shared";
import { randomBytes } from "crypto";
import request from "supertest";
import { app } from "../../app";

// const sendMailMock = jest.fn();
// jest.mock("nodemailer");

// nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
// beforeEach(() => {
//   sendMailMock.mockClear();
//   nodemailer.createTransport.mockClear();
// });

beforeAll(async () => {
  await inicializarSistema();
});

describe("cambia la password", () => {
  it("existe la url", async () => {
    const email = "",
      token = "",
      password = "";
    const data: ExecuteChangePassRequest = { email, token, password };
    const response = await request(app)
      .post("/api/auth/change-pass")
      .send(data);
    expect(response.status).toBe(400);
  });
  it("cambia la pass con datos válidos", async () => {
    const email = "admin@myapp.com";
    const password = randomBytes(5).toString("hex");

    const [, token] = await crearPermisoFake(email);
    const data: ExecuteChangePassRequest = { email, token, password };

    const response = await request(app)
      .post("/api/auth/change-pass")
      .send(data);
    expect(response.status).toBe(200);
  });
});

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
