import { ICliente } from './icliente.entity';
import { IOrdenCompra } from './iorden-compra.entity';

export interface IPedido {
  id: number;
  firstName: string;
  lastName: string;
  ordenes: IOrdenCompra[];
  cliente: ICliente;
}
