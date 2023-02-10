import { dataSource } from "../../lib/data-source";
import { Local } from "../../lib/entity/local.entity";
import { In } from "typeorm";
import { OrdenCompra } from "../../lib/entity/orden-compra.entity";
import { UnidadNegocio } from "../../lib/entity/unidad-negocio.entity";
import { inicializarCencosud } from "../../lib/inicializarCencosud";

const xxx = {
  numero: "5575426472",
  emision: "15-09-2022",
  entrega: "22-09-2022",
  cliente: {
    nombre: "CENCOSUD RETAIL S.A.",
    identLegal: "C001",
    unidades: [
      {
        nombre: "Sisa",
        locales: [
          {
            codigo: "N524",
            nombre: "185 -SISA-LINARES-JANUARIO-ESP",
            id: 1,
          },
        ],
        id: 3,
      },
    ],
    ordenes: [],
    empresa: {
      id: 1,
      nombre: "myapp",
      identLegal: null,
    },
    id: 2,
  },
  lineas: [
    {
      estado: "Nada",
      cantidad: 1,
      productoId: 1,
      localId: 1,
      producto: {
        id: 1,
        nombre: "Producto de prueba",
        codigo: "DRBIO-00634",
        peso: 1,
        codCenco: "1647753",
        vigente: true,
      },
      local: {
        id: 1,
        codigo: "N524",
        nombre: "185 -SISA-LINARES-JANUARIO-ESP",
      },
    },
  ],
};

const orden = xxx as any as OrdenCompra;

beforeAll(async () => {
  await inicializarCencosud();
});

describe.skip("agregar unidad", () => {
  it("le agrega unidad a orden de compra", () => {
    expect(orden.unidad).toBeFalsy();
    agregarUnidad(orden);
    expect(orden.unidad).toBeTruthy();
  });
});

/**
 *
 * @param orden cada Línea tiene el local que tiene unidad,
 * primero sacamos todas los locales de la orden
 */
async function agregarUnidad(orden: OrdenCompra) {
  const setLoc = orden.lineas.reduce((acc, iter) => {
    acc.add(iter.local.id);
    return acc;
  }, new Set<number>());

  // Sacamos las unidades de los locales
  const ids = Array.from(setLoc);

  const locals: Array<Local> = await dataSource
    .getRepository(Local)
    .find({ where: { id: In(ids) }, relations: ["unidad"] });

  // Sacar las unidades diferentes, debe ser una sóla

  const set: Set<UnidadNegocio> = locals.reduce((acc, iter) => {
    acc.add(iter.unidad);
    return acc;
  }, new Set<UnidadNegocio>());

  const unidades = Array.from(set);
  if (unidades.length === 0) throw Error(`No hay unidades de negocio`);
  if (unidades.length > 1)
    throw Error(
      `La orden sólo debe ser de una unidad de negocio y tiene ${unidades.length}`
    );

  orden.unidad = unidades[0];
}
