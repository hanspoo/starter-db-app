import * as express from "express";
import multer = require("multer");
import { Request, Response } from "express";

import { dataSource, Archivo } from "@flash-ws/db";

const UPLOAD_FOLDER = process.env.NX_UPLOAD_FOLDER || `uploads`;

const archivos = express.Router();
archivos.get("/", async function (req: Request, res: Response) {
  const pallets = await dataSource.getRepository(Archivo).find({});
  res.json(pallets);
});

archivos.get(
  "/:id",
  async function (req: Request<{ id: number }>, res: Response) {
    if (!req.params.id)
      return res
        .status(400)
        .send("No viene el id de archivo: " + req.params.id);
    const archivo = await dataSource
      .getRepository(Archivo)
      .findOne({ where: { id: req.params.id } });
    if (!archivo)
      return res.status(404).send(`Archivo ${req.params.id} no encontrado`);
    return res.send(archivo);
  }
);

const upload = multer({ dest: UPLOAD_FOLDER });
archivos.post("/", upload.single("file"), async function (req: any, res) {
  console.log(req.file);

  const user = await dataSource.getRepository(Archivo).create(req.file);
  const results = await dataSource.getRepository(Archivo).save(user);
  return res.send(results);
});

archivos.put("/:id", async function (req: Request, res: Response) {
  const user = await dataSource.getRepository(Archivo).findOneBy({
    id: req.params.id as unknown as number,
  });
  dataSource.getRepository(Archivo).merge(user, req.body);
  const results = await dataSource.getRepository(Archivo).save(user);
  return res.send(results);
});

archivos.delete("/:id", async function (req: Request, res: Response) {
  const results = await dataSource.getRepository(Archivo).delete(req.params.id);
  return res.send(results);
});

export { archivos };
