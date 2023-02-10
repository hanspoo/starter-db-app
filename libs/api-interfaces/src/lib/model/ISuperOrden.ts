import { ILineaConsolidada } from './ILineaConsolidada';
import { IOrdenCompra } from './iorden-compra.entity';

export type ISuperOrden = IOrdenCompra & {
  lineasConsolidadas: Array<ILineaConsolidada>;
};
