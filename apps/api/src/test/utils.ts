import { dataSource, Archivo } from "@flash-ws/db";

const archivo = {
  originalname: "orden-un-local.xls",
  mimetype: "application/vnd.ms-excel",
  destination: "/home/julian/embarcadero/uploads",
  filename: "5d3b12762f0a5879d7e6be12d62c4154",
  path: "/home/julian/embarcadero/b2b-alone/apps/api/src/test/orden-una-linea.xls",
  size: 665088,
};

const repoArchivo = dataSource.getRepository(Archivo);
export async function crearArchivoValido(): Promise<Archivo> {
  return await repoArchivo.save({ ...archivo });
}
export async function crearArchivoInvalido(): Promise<Archivo> {
  return await repoArchivo.save({
    ...archivo,
    filename: "",
    path: "",
    destination: "",
  });
}
