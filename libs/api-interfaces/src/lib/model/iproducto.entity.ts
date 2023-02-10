import { IBox } from './ibox.entity';
import { ILineaDetalle } from './ilinea-detalle.entity';

export interface IProducto {
  id: number;
  nombre: string;
  codigo: string;
  peso: number;
  codCenco: string;
  vigente: boolean;
  lineas?: ILineaDetalle[];
  box: IBox;
}
