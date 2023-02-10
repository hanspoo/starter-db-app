import xlsx from "node-xlsx";
import { dataSource, Empresa, inicializarCencosud, Producto } from "../../..";

import { ProcesadorPlanilla } from "../../../lib/parser-2.0/ProcesadorPlanilla";
import { configCenco } from "../../../lib/parser-2.0/config-campos-cenco";
import { OrdenCreator } from "../../../lib/parser-2.0/OrdenCreator";

let empresa: Empresa;
beforeAll(async () => {
  await inicializarCencosud();
  empresa = (await dataSource
    .getRepository(Empresa)
    .findOne({ where: { nombre: "myapp" } })) as Empresa;
});

beforeEach(async () => {
  await dataSource.query("delete from orden_compra");
  await dataSource.query("delete from local");
  await dataSource.query("delete from unidad_negocio");
  await dataSource.query("delete from cliente");
});

describe("Usando el procesador de planillas crea toda la estructura", () => {
  it("crea la orden (3)", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);

    const result = await procesador.procesar(ws[0]);
    const { ordenes } = await new OrdenCreator(empresa).fromProcesador(result);

    expect(ordenes.length).toBe(1);
    expect(ordenes[0].numero).toBe("5575426472");
  });
  it.skip("le asigna el cliente", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);

    const result = await procesador.procesar(ws[0]);
    const { ordenes, errores } = await new OrdenCreator(empresa).fromProcesador(
      result
    );
    expect(errores.length).toBe(0);
    expect(ordenes[0].cliente).toBeTruthy();
    expect(ordenes[0].cliente.identLegal).toBe("C001");
    expect(ordenes[0].cliente.nombre).toBe("CENCOSUD RETAIL S.A.");
    expect(ordenes[0].cliente.empresa.id).toBe(empresa.id);
  });
  it.skip("crea unidad de negocio ", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);

    const { ordenes } = await new OrdenCreator(empresa).fromProcesador(result);
    expect(ordenes[0].cliente.unidades[0].nombre).toBe("Sisa");
  });
  it.skip("crea la unidad con su local", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);

    const { ordenes } = await new OrdenCreator(empresa).fromProcesador(result);
    expect(ordenes[0].cliente.unidades[0].locales[0].codigo).toBe("N524");
  });
  it("datos de la orden: emision", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);

    const { ordenes } = await new OrdenCreator(empresa).fromProcesador(result);
    expect(ordenes[0].emision).toBe("15-09-2022");
  });
  it("datos de la orden: entrega", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);

    const { ordenes } = await new OrdenCreator(empresa).fromProcesador(result);
    expect(ordenes[0].entrega).toBe("22-09-2022");
  });
});

describe("crear orden lineas, unidad y productos", () => {
  it("campos líneas de detalle: cantidad", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);

    const { ordenes } = await new OrdenCreator(empresa).fromProcesador(result);
    const linea = ordenes[0].lineas[0];
    expect(linea.cantidad).toBe(1);
  });
  it("crea las cajas", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);

    const { ordenes } = await new OrdenCreator(empresa).fromProcesador(result);
    const linea = ordenes[0].lineas[0];
    expect(linea.cajas.length).toBe(1);
  });
  it.skip("si no hemos creado el producto el creador manda errores", async () => {
    await dataSource.getRepository(Producto).clear();
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);

    const { errores } = await new OrdenCreator(empresa).fromProcesador(result);
    expect(errores.length).toBe(1);
  });
  it("la orden debe ser de una sóla unidad de negocio", async () => {
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);
    expect(result.lineas.length).toBe(1);

    const { ordenes, errores } = await new OrdenCreator(empresa).fromProcesador(
      result
    );
    expect(errores).toEqual([]);
    expect(ordenes.length).toBe(1);
    expect(ordenes[0].unidad).toBeTruthy();
  });
});
