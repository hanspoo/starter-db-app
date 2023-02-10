import { EstadoLinea } from '@flash-ws/api-interfaces';
import * as crypto from 'node:crypto';
import { dataSource } from '../data-source';
import { Empresa } from '../entity/auth/empresa.entity';
import { Box } from '../entity/box.entity';
import { Caja } from '../entity/caja.entity';
import { Cliente } from '../entity/cliente.entity';
import { LineaDetalle } from '../entity/linea-detalle.entity';
import { Local } from '../entity/local.entity';
import { OrdenCompra } from '../entity/orden-compra.entity';
import { Producto } from '../entity/producto.entity';
import { UnidadNegocio } from '../entity/unidad-negocio.entity';

export async function crearOrdenHelper(numLineas = 1): Promise<OrdenCompra> {
  const sisa = await dataSource
    .getRepository(UnidadNegocio)
    .findOne({ where: { id: 1 } });

  if (!sisa) throw Error('Debe estar creada unidad de negocio para usar esto');

  const box = new Box();

  box.largo = 49;
  box.ancho = 40;
  box.alto = 11;

  const p = new Producto();

  p.nombre = 'Bandeja Diseño Ely Chica';
  p.codigo = 'CT-01005430';
  p.peso = 1950;
  p.codCenco = '1651844';
  p.vigente = true;
  p.box = box;
  const e = await dataSource
    .getRepository(Empresa)
    .findOne({ where: { nombre: 'myapp' } });

  if (!e) throw Error('Debe estar creada la empresa myapp');
  p.empresa = e;

  const producto = await dataSource.getRepository(Producto).save(p);
  const clientes = await dataSource.getRepository(Cliente).find();
  if (clientes.length === 0)
    throw Error('No hay clientes, se cancela orden de prueba');

  const orden = new OrdenCompra();
  orden.unidad = sisa;
  orden.numero = crypto.randomInt(100000000) + '';
  orden.emision = '15-09-2022';
  orden.entrega = '22-09-2022';
  orden.cliente = clientes[0];

  let local = new Local();
  local.nombre = crypto.randomBytes(12).toString('hex');
  local.codigo = local.nombre;
  local.unidad = sisa;

  local = await dataSource.getRepository(Local).save(local);

  orden.lineas = [];
  for (let index = 0; index < numLineas; index++) {
    const linea = new LineaDetalle();
    linea.cantidad = 1;
    linea.producto = producto;
    linea.local = local;
    linea.estado = EstadoLinea.Aprobada;
    const caja = new Caja();
    caja.linea = linea;
    linea.cajas = [caja];
    orden.lineas.push(linea);
  }

  return await dataSource.getRepository(OrdenCompra).save(orden);
}
