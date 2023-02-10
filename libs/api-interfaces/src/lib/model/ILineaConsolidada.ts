import { EstadoLinea } from '../EstadoLinea';
import { ILineaDetalle } from './ilinea-detalle.entity';

export class ILineaConsolidada {
  cantidad: number;
  lineas: Array<ILineaDetalle>;
  productoId: number;
  estado: EstadoLinea;
  constructor() {
    this.cantidad = 1;
  }
}
