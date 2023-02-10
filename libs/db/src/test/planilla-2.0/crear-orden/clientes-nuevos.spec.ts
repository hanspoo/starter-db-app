import { randomBytes } from "crypto";
import { ProcesadorPlanilla } from "../../../lib/parser-2.0/ProcesadorPlanilla";
import { OrdenCreator } from "../../../lib/parser-2.0/OrdenCreator";
import { dataSource } from "../../../lib/data-source";
import { Empresa } from "../../../lib/entity/auth/empresa.entity";
import { Cliente } from "../../../lib/entity/cliente.entity";
import { UnidadNegocio } from "../../../lib/entity/unidad-negocio.entity";
import { inicializarCencosud } from "../../../lib/inicializarCencosud";
import { configCenco } from "../../../lib/parser-2.0/config-campos-cenco";

import {
  LineBuilder,
  SheetBuilder,
} from "../columnas-parametricas/hoja-builder";

const repoCli = dataSource.getRepository(Cliente);

let empresa: Empresa;
beforeAll(async () => {
  await inicializarCencosud();
  empresa = (await dataSource
    .getRepository(Empresa)
    .findOne({ where: { nombre: "myapp" } })) as Empresa;
});

beforeEach(async () => {
  await dataSource.query("delete from usuario");
  await dataSource.query("delete from linea_detalle");
  await dataSource.query("delete from local");
  await dataSource.query("delete from unidad_negocio");
  await dataSource.query("delete from cliente");
});
describe("cliente nuevo", () => {
  it("debe crear el cliente", async () => {
    const identLegal = randomBytes(10).toString("hex");

    const l1 = new LineBuilder().build();
    const hoja = new SheetBuilder()
      .withIdentLegal(identLegal)
      .addLines(l1)
      .build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);
    await new OrdenCreator(empresa).fromProcesador(result);

    const cliente = await dataSource
      .getRepository(Cliente)
      .findOne({ where: { identLegal } });

    expect(cliente).toBeTruthy();
  });
  it.skip("debe crear el cliente y la unidad de negocio", async () => {
    const nombre = randomBytes(10).toString("hex");

    const l1 = new LineBuilder().withUnidad(nombre).build();
    const hoja = new SheetBuilder().addLines(l1).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);
    await new OrdenCreator(empresa).fromProcesador(result);

    const unidad = await dataSource
      .getRepository(UnidadNegocio)
      .findOne({ where: { nombre } });

    expect(unidad).toBeTruthy();
  });
});
