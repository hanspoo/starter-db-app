import fs from 'fs';
import xlsx from 'node-xlsx';
import { LoaderPostBody } from '@flash-ws/api-interfaces';
import {
  dataSource,
  Archivo,
  ProcesadorPlanilla,
  OrdenCreator,
  FieldsMapper,
} from '@flash-ws/db';
import express, { Request, Response } from 'express';

export const loader = express.Router();

loader.post(
  '/subir',
  async function (
    req: Request<null, null, LoaderPostBody, null>,
    res: Response<any>
  ) {
    const { idArchivo } = req.body;

    if (!idArchivo) {
      return res
        .status(400)
        .send({ msg: 'LDR001: No viene el id del archivo' });
    }

    const archivo = await dataSource
      .getRepository(Archivo)
      .findOne({ where: { id: idArchivo } });
    if (!archivo) {
      return res
        .status(400)
        .send({ msg: `LDR002: Archivo ${idArchivo} no encontrado` });
    }

    if (!fs.existsSync(archivo.path)) {
      const msg = `LDR003: Archivo path: ${archivo.path} no existe en el sistema`;
      console.log(archivo);
      return res.status(400).send({ msg });
    }

    const { idFieldsMapper } = req.body;

    if (!idFieldsMapper) {
      return res
        .status(400)
        .send({ msg: 'LDR011: No viene el id del fieldsMapper' });
    }

    const fieldsMapper = await dataSource
      .getRepository(FieldsMapper)
      .findOne({ where: { id: idFieldsMapper }, relations: ['campos'] });
    if (!fieldsMapper) {
      return res
        .status(400)
        .send({ msg: `LDR010: Fields mapper ${idFieldsMapper} no encontrado` });
    }

    const ws = xlsx.parse(archivo.path);

    const procesador = new ProcesadorPlanilla(fieldsMapper);

    const result = await procesador.procesar(ws[0]);
    if (result.ordenes.length === 0)
      return res
        .status(400)
        .send({ msg: 'LDR007: No vienen ordenes en la planilla' });

    try {
      const { ordenes, errores } = await new OrdenCreator(
        req['empresa']
      ).fromProcesador(result);

      if (errores.length > 0)
        return res
          .status(400)
          .send({ msg: 'LDR009: Falta crear productos', errores });

      if (ordenes.length === 0)
        return res.status(400).send({ msg: 'LDR008: No se crearon ordenes' });

      res.send(ordenes.map((o) => o.id));
    } catch (error) {
      console.log('atrapando error al 2 ', JSON.stringify(error));
      res.status(400).send({ msg: 'LDR006: Error procesando la planilla' });
    }
  }
);
