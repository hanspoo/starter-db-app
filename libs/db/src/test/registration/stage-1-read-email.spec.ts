// para el registro, la única validación es que el email sea válido y no esté usado por otro usuario
// validar que genere y envie el código de validación

import { randomEmail } from "@flash-ws/shared";
import { dataSource } from "../../lib/data-source";
import { SolicitudAutenticarEmail } from "../../lib/entity/auth/solicitud-autenticar-email.entity";
import { inicializarSistema } from "../../lib/inicializarSistema";
import { RegistrationEmailStageService } from "../../lib/registration/RegistrationServiceEmailStage";

const repoSol = dataSource.getRepository(SolicitudAutenticarEmail);
const sendMailMock = jest.fn();
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
}));

beforeAll(async () => {
  await inicializarSistema();
});

describe("registration", () => {
  it("email nuevo da ok", async () => {
    const service = new RegistrationEmailStageService(randomEmail());
    const response = await service.execute();
    expect(response.success).toBe(true);
  });
  it("email vacio da false", async () => {
    const service = new RegistrationEmailStageService("");
    const response = await service.execute();
    expect(response.success).toBe(false);
  });
  it("email existente da error", async () => {
    const service = new RegistrationEmailStageService("admin@myapp.com");
    const response = await service.execute();
    expect(response.success).toBe(false);
  });
  it("email valido envía código de verificación", async () => {
    const service = new RegistrationEmailStageService(randomEmail());
    await service.execute();
    expect(sendMailMock).toBeCalled();
  });
  it("email valido crear solicitud de email", async () => {
    const email = randomEmail();
    await new RegistrationEmailStageService(email).execute();

    const sol = repoSol.findOne({ where: { email } });
    expect(sol).toBeTruthy();
  });
});
