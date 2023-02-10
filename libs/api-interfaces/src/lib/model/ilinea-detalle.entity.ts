import { EstadoLinea } from '../EstadoLinea';
import { ICaja } from './icaja.entity';
import { ILocal } from './ilocal.entity';
import { IOrdenCompra } from './iorden-compra.entity';
import { IProducto } from './iproducto.entity';

export interface ILineaDetalle {
  id: number;
  cantidad: number;
  ordenCompra: IOrdenCompra;
  producto: IProducto;
  productoId?: number;
  local: ILocal;
  localId?: number;
  estado: EstadoLinea;
  cajas: ICaja[];
}
