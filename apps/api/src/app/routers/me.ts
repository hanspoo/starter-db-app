import { Me } from '@flash-ws/api-interfaces';
import { Empresa, Usuario } from '@flash-ws/db';
import express, { Request, Response } from 'express';

export const me = express.Router();

me.get('/', async function (req: Request, res: Response<Me>) {
  const u: Usuario = req['user'];
  const e: Empresa = req['empresa'];
  const me: Me = {
    nombre: u.nombre,
    email: u.email,
    empresa: e.nombre,
  };
  res.send(me);
});
