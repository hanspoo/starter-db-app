import { ifDebug } from '@flash-ws/shared';
import { In } from 'typeorm';
import { dataSource } from '../data-source';
import { Empresa } from '../entity/auth/empresa.entity';
import { Caja } from '../entity/caja.entity';
import { Cliente } from '../entity/cliente.entity';
import { LineaDetalle } from '../entity/linea-detalle.entity';
import { Local } from '../entity/local.entity';
import { OrdenCompra } from '../entity/orden-compra.entity';
import { Producto } from '../entity/producto.entity';
import { UnidadNegocio } from '../entity/unidad-negocio.entity';
import { LineaCruda } from './ProcesadorPlanilla';

export async function crearOrdenes(
  empresa: Empresa,
  cliente: Cliente,
  ordenes: Partial<OrdenCompra>[],
  lineas: LineaCruda[]
) {
  const repoOrdenes = dataSource.getRepository(OrdenCompra);
  const repoEmpresa = dataSource.getRepository(Empresa);
  const repoLinea = dataSource.getRepository(LineaDetalle);

  const ordenesCreadas: Array<OrdenCompra> = [];

  // {where: {id: empresa.id}}, {relations:["productos"]}}
  const e = await repoEmpresa.findOne({
    where: { id: empresa.id },
    relations: ['productos'],
  });

  if (!e) throw Error(`La empresa ${empresa.id} no fue encontrada`);

  if (!e.productos) throw Error('La empresa no tiene los productos definidos');
  const findByCodigo: Record<string, Producto> = e.productos.reduce(
    (acc: Record<string, Producto>, iter: Producto) => {
      acc[iter.codigo] = iter;
      return acc;
    },
    {}
  );
  const findByCodCenco: Record<string, Producto> = e.productos.reduce(
    (acc: Record<string, Producto>, iter: Producto) => {
      acc[iter.codCenco] = iter;
      return acc;
    },
    {}
  );
  const locs: Local[] = cliente.unidades.reduce((acc: any, iter: any) => {
    acc = [...acc, ...iter.locales];
    return acc;
  }, []);

  const findByLocal: Record<string, Local> = locs.reduce(
    (acc: any, iter: any) => {
      acc[iter.codigo] = iter;
      return acc;
    },
    {}
  );

  // const productosFinder = process.env.USAR_COD_CENCO
  //   ? findByCodCenco
  //   : findByCodigo;
  for (let i = 0; i < ordenes.length; i++) {
    ifDebug('Creando orden ' + i);

    const orden = repoOrdenes.create(ordenes[i]);
    orden.cliente = cliente;

    orden.lineas = lineas
      .filter((linea) => linea.numOrden === orden.numero)
      .map(({ cantidad, codLocal, codProdCliente }) => {
        ifDebug('Creando líneas');
        const producto = findByCodCenco[codProdCliente];
        if (!producto)
          throw Error(
            `Producto ${codProdCliente} no encontrado en empresa ${empresa.nombre}`
          );
        const local = findByLocal[codLocal];
        if (!local)
          throw Error(
            `Local ${codLocal} no encontrado en cliente ${cliente.nombre}`
          );

        const l = repoLinea.create({ cantidad, producto, local, cajas: [] });

        for (let i = 0; i < l.cantidad; i++) {
          const caja = new Caja();
          caja.linea = l;
          l.cajas.push(caja);
        }

        return l;
      });

    await agregarUnidad(orden);
    ordenesCreadas.push(orden as OrdenCompra);
  }

  return ordenesCreadas;
}

async function agregarUnidad(orden: OrdenCompra) {
  const setLoc = orden.lineas.reduce((acc, iter) => {
    acc.add(iter.local.id);
    return acc;
  }, new Set<number>());

  // Sacamos las unidades de los locales
  const ids = Array.from(setLoc);

  const locals: Array<Local> = await dataSource
    .getRepository(Local)
    .find({ where: { id: In(ids) }, relations: ['unidad'] });

  // Sacar las unidades diferentes, debe ser una sóla

  const INITIAL: Record<string, UnidadNegocio> = {};
  const objUnidades: Record<string, UnidadNegocio> = locals.reduce(
    (acc, iter) => {
      acc[iter.unidad.id + ''] = iter.unidad;
      return acc;
    },
    INITIAL
  );

  const unidades = Array.from(Object.values(objUnidades));
  if (unidades.length === 0) throw Error(`No hay unidades de negocio`);
  if (unidades.length > 1)
    throw Error(
      `La orden sólo debe ser de una unidad de negocio y tiene ${unidades.length}:` +
        JSON.stringify(unidades)
    );

  orden.unidad = unidades[0];
}
