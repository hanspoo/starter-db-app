import { Cliente } from '../../lib/entity/cliente.entity';
import { OrdenCompra } from '../entity/orden-compra.entity';
import { FieldsMapper } from '../entity/campos/FieldsMapper';
import { Campo } from '@flash-ws/api-interfaces';
import { fixNombreLocal } from '@flash-ws/shared';

type Sheet = { name: string; data: unknown[] };
export type LineaCruda = {
  unidad: string;
  numOrden: string;
  codProdCliente: string;
  codProducto: string;
  cantidad: number;
  codLocal: string;
};
export type LocalCrudo = {
  codigo: string;
  nombre: string;
  unidad: string;
};

export class ProcesadorPlanilla {
  constructor(public config: FieldsMapper) {
    if (!config) throw Error('No viene el mapeador de campos');
    if (!config.campos)
      throw Error('El mapeador no tiene definidos los campos');
    if (config.campos.length === 0) throw Error('El mapeador no tiene campos');
  }
  pos(campo: Campo): number {
    const cc = this.config.campos.find((f) => f.campo === campo);
    if (!cc)
      throw Error(`campo ${campo} no encontrado en configuración entregada`);
    return cc.columna - 1; // la posición del array de datos es -1
  }
  async procesar(sheet: Sheet): Promise<ResultadoProceso> {
    // Ubicar la columna del RUT del cliente
    const clientes = this.extraeClientes(sheet);
    const unidades = this.extraeUnidades(sheet);
    const locales = this.extraeLocales(sheet);
    const lineas = this.extraeLineas(sheet);
    const ordenes = this.extraeOrdenes(sheet);

    return Promise.resolve({ clientes, unidades, locales, lineas, ordenes });
  }

  extraeLineas(sheet: Sheet): Array<LineaCruda> {
    const datosProcesar = [...sheet.data].splice(1);
    const array: Array<LineaCruda> = datosProcesar.map((linea: any) => {
      const codProdCliente: string = linea[this.pos(Campo.COD_CENCOSUD)];
      const codProducto: string = linea[this.pos(Campo.COD_PRODUCTO)];
      const cantidad: number = linea[this.pos(Campo.CANTIDAD)];
      const codLocal: string = linea[this.pos(Campo.COD_LOCAL)];
      const unidad: string = linea[this.pos(Campo.UNIDAD_NEGOCIO)];
      const numOrden: string = linea[this.pos(Campo.NUM_ORDEN)] + '';

      const l: LineaCruda = {
        unidad,
        codProdCliente,
        codProducto,
        cantidad,
        codLocal,
        numOrden,
      };

      return l;
    });

    return array;
  }
  extraeLocales(sheet: Sheet): Array<LocalCrudo> {
    const obj: any = [...sheet.data].splice(1).reduce((acc: any, iter: any) => {
      const codigo = iter[this.pos(Campo.COD_LOCAL)];
      const nombre = fixNombreLocal(iter[this.pos(Campo.NOMBRE_LOCAL)]);
      const unidad = iter[this.pos(Campo.UNIDAD_NEGOCIO)];
      acc[`${codigo},${nombre},${unidad}`] = 1;
      return acc;
    }, {});

    const ids = Object.keys(obj);
    const locals = ids.map((s) => {
      const [codigo, nombre, unidad] = s.split(',');
      const c: LocalCrudo = {
        codigo,
        nombre,
        unidad,
      };
      return c;
    });

    return locals;
  }

  extraeClientes(sheet: Sheet): Array<Cliente> {
    const obj: any = [...sheet.data].splice(1).reduce((acc: any, iter: any) => {
      const identLegal = iter[this.pos(Campo.IDENT_LEGAL)];
      const nombre = iter[this.pos(Campo.NOMBRE_CLIENTE)];
      acc[`${identLegal},${nombre}`] = 1;
      return acc;
    }, {});

    const ids = Object.keys(obj);
    const clientes = ids.map((s) => {
      const c = new Cliente();
      const [identLegal, nombre] = s.split(',');
      c.identLegal = identLegal;
      c.nombre = nombre;
      return c;
    });

    return clientes;
  }

  extraeOrdenes(sheet: Sheet): Array<OrdenCompra> {
    const obj: any = [...sheet.data].splice(1).reduce((acc: any, iter: any) => {
      const numOrden = iter[this.pos(Campo.NUM_ORDEN)];
      const fecEmision = iter[this.pos(Campo.FEC_EMISION)];
      const fecEntrega = iter[this.pos(Campo.FEC_ENTREGA)];
      acc[`${numOrden},${fecEmision},${fecEntrega}`] = 1;
      return acc;
    }, {});

    const ids = Object.keys(obj);
    const ordenes = ids.map((s) => {
      const c = new OrdenCompra();
      const [numOrden, fecEmision, fecEntrega] = s.split(',');
      c.numero = numOrden;
      c.emision = fecEmision;
      c.entrega = fecEntrega;
      return c;
    });

    return ordenes;
  }

  extraeUnidades(sheet: Sheet): Array<string> {
    const obj: any = [...sheet.data].splice(1).reduce((acc: any, iter: any) => {
      const unidad = iter[this.pos(Campo.UNIDAD_NEGOCIO)];
      acc[unidad] = 1;
      return acc;
    }, {});

    const nombres = Object.keys(obj);

    return nombres;
  }
}

export type ResultadoProceso = {
  ordenes: Partial<OrdenCompra>[];
  clientes: Partial<Cliente>[];
  unidades: string[];
  locales: LocalCrudo[];
  lineas: LineaCruda[];
};
