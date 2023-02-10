import {
  dataSource,
  Empresa,
  LineaDetalle,
  Local,
  Producto,
  ProductoService,
  UnidadNegocio,
} from '../..';
import { Cliente } from '../entity/cliente.entity';
import { OrdenCompra } from '../entity/orden-compra.entity';
import { LineaCruda, LocalCrudo, ResultadoProceso } from './ProcesadorPlanilla';
import { crearOrdenes } from './CrearOrdenes';
import { ifDebug } from '@flash-ws/shared';

type ResultCrearOrdenes = {
  ordenes: Array<OrdenCompra>;
  errores: Array<string>;
};

export class OrdenCreator {
  constructor(public empresa: Empresa) {}
  async fromProcesador({
    ordenes,
    clientes,
    unidades,
    locales,
    lineas,
  }: ResultadoProceso): Promise<ResultCrearOrdenes> {
    // Creamos el cliente y pasamos un cliente persistido a la orden
    // const validadorProductos = process.env.USAR_COD_CENCO
    //   ? this.erroresProductosCodigoCliente
    //   : this.erroresProductosCodigoProveedor;
    const errores = await this.erroresProductosCodigoCenco(lineas);
    if (errores.length > 0) return { ordenes: [], errores };

    const cli = clientes[0];
    const identLegal = cli.identLegal;

    const repoOrdenes = dataSource.getRepository(OrdenCompra);
    const repoCliente = dataSource.getRepository(Cliente);
    const repoUnidad = dataSource.getRepository(UnidadNegocio);
    let cliente = await repoCliente.findOne({
      relations: ['unidades', 'unidades.locales', 'ordenes'],
      where: { identLegal, empresa: { id: this.empresa.id } },
    });

    if (cliente) {
      ifDebug('Cliente ya existe');

      const nuevas = unidadesNuevas(cliente, unidades);
      nuevas.forEach((u) => cliente!.unidades!.push(u));
      mezclarLocales(cliente, locales);
      cliente = await repoCliente.save(cliente);
    } else {
      ifDebug('Cliente Nuevo');
      cli.unidades = unidades.map((nombre) =>
        repoUnidad.create({
          nombre,
          locales: this.localesParaUnidad(nombre, locales),
        })
      );
      cli.empresa = this.empresa;
      cli.ordenes = [];
      const nuevoCliente = repoCliente.create(cli);
      ifDebug('nuevo', JSON.stringify(nuevoCliente));

      try {
        ifDebug('Actualizando cliente');

        cliente = await repoCliente.save(nuevoCliente);
      } catch (error) {
        console.log('error en repoCliente.save', JSON.stringify(error));
        throw error;
      }
    }

    const ordenesNuevas = await crearOrdenes(
      this.empresa,
      cliente,
      ordenes,
      lineas
    );
    const ordsSalvadas = await Promise.all(
      ordenesNuevas.map((orden) => repoOrdenes.save(orden))
    );

    return { ordenes: ordsSalvadas, errores: [] };
  }

  localesParaUnidad(unidad: string, locales: LocalCrudo[]): Local[] {
    const repoLocal = dataSource.getRepository(Local);

    return locales
      .filter((lc) => lc.unidad === unidad)
      .map((lc) => {
        return repoLocal.create({ codigo: lc.codigo, nombre: lc.nombre });
      });
  }

  async erroresProductosCodigoProveedor(
    lineas: LineaCruda[]
  ): Promise<string[]> {
    const service = new ProductoService(this.empresa);

    const prods = new Set<string>(lineas.map((l) => l.codProducto));
    const array = Array.from(prods);
    const errores = [];
    for (let i = 0; i < array.length; i++) {
      const prod = array[i];
      const p = await service.findByCodigo(prod);
      if (p === null) errores.push(`Producto: "${prod}", no encontrado`);
    }
    return errores;
  }

  async erroresProductosCodigoCenco(lineas: LineaCruda[]): Promise<string[]> {
    const productos = await dataSource
      .getRepository(Producto)
      .find({ where: { empresa: { id: this.empresa.id } } });

    // if (!e) throw Error(`La empresa ${this.empresa.id} no se pudo recuperar`);

    if (productos.length === 0)
      throw Error(`La empresa ${this.empresa.id} no tiene productos`);

    const byCodCenco: Record<string, any> = productos.reduce((acc, iter) => {
      acc[iter.codCenco] = iter;
      return acc;
    }, <Record<string, any>>{});

    const prods = new Set<string>(lineas.map((l) => l.codProdCliente));
    const array = Array.from(prods);
    const errores = [];
    for (let i = 0; i < array.length; i++) {
      const prod = array[i];

      if (!byCodCenco[prod]) errores.push(`Producto: "${prod}", no encontrado`);
    }
    return errores;
  }
}
function unidadesNuevas(
  cliente: Cliente,
  unidadesNuevas: string[]
): UnidadNegocio[] {
  const nuevas = unidadesNuevas.filter((nombre) => {
    return !existeUnidad(cliente, nombre);
  });
  return nuevas.map((s) => {
    const u = new UnidadNegocio();
    u.nombre = s;
    u.locales = [];
    return u;
  });
}
function existeUnidad(cliente: Cliente, nombre: string) {
  const re = new RegExp(nombre);

  return cliente.unidades.find((u) => re.test(u.nombre));
}
function mezclarLocales(cliente: Cliente, locales: LocalCrudo[]): void {
  const mapaUnidadLocal: Record<string, LocalCrudo[]> = locales.reduce(
    (acc: any, iter: LocalCrudo) => {
      const ele = acc[iter.unidad];
      if (ele) {
        acc[iter.unidad] = [...ele, iter];
      } else {
        acc[iter.unidad] = [iter];
      }
      return acc;
    },
    {}
  );

  ifDebug('cliente.unidades', cliente.unidades);

  const repoLocal = dataSource.getRepository(Local);

  Object.keys(mapaUnidadLocal).forEach((nombreUnidad) => {
    const unidad = cliente.unidades.find((u) => u.nombre === nombreUnidad);
    if (!unidad) throw Error(`La unidad ${unidad} debe existir a esta altura`);

    const locales = mapaUnidadLocal[nombreUnidad];
    locales.forEach((localPlanilla) => {
      const localActual = unidad.locales.find(
        ({ codigo }) => codigo === localPlanilla.codigo
      );
      if (localActual) return;
      ifDebug(`Agregando local ${localPlanilla.nombre}`);

      unidad.locales.push(
        repoLocal.create({
          codigo: localPlanilla.codigo,
          nombre: localPlanilla.nombre,
        })
      );
    });
  });
}
