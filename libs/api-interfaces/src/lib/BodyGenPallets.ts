import { Distribuir, Ordenar } from './api-interfaces';

export type BodyGenPallets = {
  protoID: number;
  nextHU?: number;
  ordenar?: Ordenar;
  distribuir?: Distribuir;
};
