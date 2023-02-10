import { EstadoLinea } from './EstadoLinea';

export interface CambiarEstadoBody {
  ids: number[];
  estado: EstadoLinea;
}
