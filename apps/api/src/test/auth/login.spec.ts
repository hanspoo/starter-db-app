import { LoginRequest } from "@flash-ws/api-interfaces";
import { dataSource, Empresa, inicializarCencosud } from "@flash-ws/db";
import request = require("supertest");
import { app } from "../../app";

beforeAll(async () => {
  await inicializarCencosud();
  // const u = dataSource
  //   .getRepository(Usuario)
  //   .create({ email: 'info@welinux.cl', password: '123456' });

  const empresa = await dataSource
    .getRepository(Empresa)
    .findOne({ where: { id: 1 } });

  // empresa.usuarios = [u];
  await dataSource.getRepository(Empresa).save(empresa);
});
const credentials: LoginRequest = {
  email: "admin@myapp.com",
  password: "123456",
};

describe("login", () => {
  it("responde token en login correcto", async () => {
    const res = await request(app).post("/api/auth/login").send(credentials);
    expect(res.statusCode).toEqual(200);
    console.log(res.headers["x-token"]);

    expect(res.headers["x-token"]).toBeTruthy();
  });
  it("puede acceder a home page: ordenes con el token", async () => {
    const loginResult = await request(app)
      .post("/api/auth/login")
      .send(credentials);

    const token = loginResult.headers["x-token"];

    const landingResult = await request(app)
      .get("/api/me")
      .set("Authorization", `Bearer ${token}`);
    expect(landingResult.statusCode).toEqual(200);
  });
  it("recuperar contraseña", async () => {
    const data = { email: "admin@myapp.com" };
    const response = await request(app)
      .post("/api/auth/recover-pass")
      .send(data);

    expect(response.statusCode).toEqual(200);
  });
});
