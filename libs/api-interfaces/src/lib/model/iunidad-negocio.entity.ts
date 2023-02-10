import { ICliente } from './icliente.entity';
import { ILocal } from './ilocal.entity';
import { IOrdenCompra } from './iorden-compra.entity';

export interface IUnidadNegocio {
  id: number;
  nombre: string;
  cliente: ICliente;
  locales: ILocal[];
  ordenes: IOrdenCompra[];
}
