import { IBox } from './ibox.entity';
import { ICaja } from './icaja.entity';
import { ILocal } from './ilocal.entity';
import { IOrdenCompra } from './iorden-compra.entity';

export interface IPallet {
  id: number;
  hu?: number;
  ordenCompra: IOrdenCompra;
  ordenCompraId?: string;
  box: IBox;
  local: ILocal;
  localId?: number;
  cajas: ICaja[];
}
