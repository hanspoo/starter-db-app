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
  empresa = <Empresa>(
    await dataSource
      .getRepository(Empresa)
      .findOne({ where: { nombre: "myapp" } })
  );
});

beforeEach(async () => {
  await dataSource.query("delete from usuario");
  await dataSource.query("delete from linea_detalle");
  await dataSource.query("delete from local");
  await dataSource.query("delete from unidad_negocio");
  await dataSource.query("delete from cliente");
});
describe("crear unidades de negocio ordenes", () => {
  describe("cliente existente", () => {
    it.skip("debe crear la unidad de negocio", async () => {
      const nombreUnidad = randomBytes(10).toString("hex");

      await repoCli.save(
        repoCli.create({ identLegal: "C001", nombre: "Cliente 01" })
      );

      const l1 = new LineBuilder().withUnidad(nombreUnidad).build();
      const hoja = new SheetBuilder().addLines(l1).build();

      const procesador = new ProcesadorPlanilla(configCenco);
      const result = await procesador.procesar(hoja);
      await new OrdenCreator(empresa).fromProcesador(result);

      const unidad = await dataSource
        .getRepository(UnidadNegocio)
        .findOne({ where: { nombre: nombreUnidad } });

      expect(unidad).toBeTruthy();
    });
    it("debe crear local de la unidad de negocio", async () => {
      const nombreUnidad = randomBytes(10).toString("hex");
      const nombreLocal = randomBytes(10).toString("hex");

      await repoCli.save(
        repoCli.create({ identLegal: "C001", nombre: "Cliente 01" })
      );

      const l1 = new LineBuilder()
        .withUnidad(nombreUnidad)
        .withLocal(nombreLocal)
        .build();
      const hoja = new SheetBuilder().addLines(l1).build();

      const procesador = new ProcesadorPlanilla(configCenco);
      const result = await procesador.procesar(hoja);
      await new OrdenCreator(empresa).fromProcesador(result);

      const unidad = await dataSource
        .getRepository(UnidadNegocio)
        .findOne({ where: { nombre: nombreUnidad }, relations: ["locales"] });

      expect(unidad).toBeTruthy();
      if (!unidad) throw Error("unidad no puede ser nulo");
      expect(unidad.locales.length).toBe(1);
    });
  });
});

// ('debe crear la unidad de negocio para cliente existente, unidad nombre existente');
