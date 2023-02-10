import { IFieldMap } from './ifield-map';
import { TipoPlanilla } from './TipoPlanilla';

export interface IFieldsMapper {
  id: number;
  nombre: string;
  tipo: TipoPlanilla;
  campos: Array<IFieldMap>;
}
