import { EstadoLinea } from './EstadoLinea';

export interface BodyCambioEstadoProdConsolidada {
  estado: EstadoLinea;
  productos: Array<number>;
}
