import { inicializarSistema } from "@flash-ws/db";

import request = require("supertest");
import { app } from "../../app";

beforeAll(async () => {
  await inicializarSistema();
});

describe("middleware authentication", () => {
  it("requiere token válido en /api/productos", async () => {
    const res = await request(app).get("/api/me");
    expect(res.statusCode).toEqual(401);
  });
  it("no requiere token válido en /api/auth/login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "info@welinux.cl",
      password: "123456",
    });

    expect(res.statusCode).toEqual(200);
  });
});
