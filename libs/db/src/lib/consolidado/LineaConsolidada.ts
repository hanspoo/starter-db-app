import { EstadoLinea } from '@flash-ws/api-interfaces';
import { LineaDetalle } from '../entity/linea-detalle.entity';

export class LineaConsolidada {
  cantidad: number;
  lineas: Array<LineaDetalle>;
  productoId: number;
  estado: EstadoLinea;
  constructor() {
    this.cantidad = 1;
  }
}
