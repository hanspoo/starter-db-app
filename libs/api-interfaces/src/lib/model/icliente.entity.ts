import { IOrdenCompra } from './iorden-compra.entity';
import { IUnidadNegocio } from './iunidad-negocio.entity';

export interface ICliente {
  id: number;
  nombre: string;
  identLegal: string;
  unidades: IUnidadNegocio[];
  ordenes: IOrdenCompra[];
}
