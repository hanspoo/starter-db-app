// process.env.NODE_ENV = 'dev';

import { inicializarSistema } from "../../../lib//inicializarSistema";
import { ProductoService } from "../../../lib/ProductosService";
import { OrdenCreator } from "../../../lib//parser-2.0/OrdenCreator";
import { b2b } from "./b2b";
import { Empresa } from "../../../lib/entity/auth/empresa.entity";

let empresa: Empresa;

beforeAll(async () => {
  empresa = await inicializarSistema();
  const service = new ProductoService(empresa);
  await service.cargarPlanilla(
    "/home/julian/embarcadero/b2b-alone/fixtures/productos.xlsx"
  );
});

it.skip("crear ordenes usando el b2b", async () => {
  await new OrdenCreator(empresa).fromProcesador(b2b as any);
});
