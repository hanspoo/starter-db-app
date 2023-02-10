import {
  SignupRequest,
  RequestValidaCodSeguridad,
} from "@flash-ws/api-interfaces";
import {
  CrearUsuarioService,
  dataSource,
  MotivoPermiso,
  PermisoUsarEmail,
  RegistrationEmailStageService,
  SolicitudRegistro,
  ValidarSolicitudAutenticarEmail,
} from "@flash-ws/db";
import { randomInt } from "crypto";
import * as express from "express";
import { Request, Response } from "express";

const registration = express.Router();

/**
 * El usuario tiene en el front todos los datos,
 * nos manda, ha obtenido un token para
 * poder registrar ese email. Revisamos nuevamente el token.
 */

registration.post(
  "/create-company",
  async function (req: Request<null, null, SignupRequest>, res: Response) {
    const { email, token, empresa, nombre, password, identLegal } = req.body;

    const repoPermiso = dataSource.getRepository(PermisoUsarEmail);
    const permiso = await repoPermiso.findOne({
      where: {
        email,
        token,
        motivo: MotivoPermiso.REGISTRAR_EMPRESA,
        vigente: true,
      },
    });

    if (!permiso) {
      res.statusMessage = "Permiso expirado";
      res.send(400);
    }

    const repoSol = dataSource.getRepository(SolicitudRegistro);
    const sol: SolicitudRegistro = await repoSol.save(
      repoSol.create({
        email,
        empresa,
        identLegal,
        nombre,
        password,
        cseg: randomInt(1000000000),
      })
    );
    try {
      const e = await new CrearUsuarioService().crearDesdeSolicitud(sol);
      console.log(`Se ha creado la empresa ${e.nombre}`);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);
registration.post(
  "/validate-email",
  async function (req: Request<null, null, { email: string }>, res: Response) {
    const { email } = req.body;

    const service = new RegistrationEmailStageService(email);
    const response = await service.execute();

    const httpCode = response.success ? 200 : 400;
    res.statusMessage = response.msg;
    return res.status(httpCode).end();
  }
);

registration.post(
  "/valida-cod-seguridad",
  async (
    req: Request<null, null, RequestValidaCodSeguridad>,
    res: Response
  ) => {
    const { email, cseg } = req.body;
    if (!(email && cseg)) {
      console.log("Requerimiento sin email ni código de securidad");
      return res.status(400).send("Debe entregar el email y contraseña");
    }

    const service = new ValidarSolicitudAutenticarEmail();
    const response = await service.execute(
      email,
      cseg,
      MotivoPermiso.REGISTRAR_EMPRESA
    );
    if (response.success) {
      return res.send({ token: response.permiso.token });
    }

    res.statusMessage = response.msg;
    return res.status(400).end();
  }
);

export { registration };
