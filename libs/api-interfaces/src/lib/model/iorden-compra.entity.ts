import { ICliente } from './icliente.entity';
import { ILineaDetalle } from './ilinea-detalle.entity';
import { IPallet } from './ipallet.entity';
import { IUnidadNegocio } from './iunidad-negocio.entity';

export interface IOrdenCompra {
  id: string;
  numero: string;
  emision: string;
  entrega: string;
  unidad: IUnidadNegocio;
  lineas: ILineaDetalle[];
  cliente: ICliente;
  pallets: IPallet[];
}
