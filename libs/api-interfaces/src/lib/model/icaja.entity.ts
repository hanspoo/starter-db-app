import { ILineaDetalle } from './ilinea-detalle.entity';
import { IPallet } from './ipallet.entity';

export interface ICaja {
  id: number;
  linea: ILineaDetalle;
  pallet: IPallet;
}
