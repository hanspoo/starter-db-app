import { IBox } from './ibox.entity';

export interface IProtoPallet {
  id: number;
  nombre: string;
  box: IBox;
}
