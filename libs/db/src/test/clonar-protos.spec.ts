import { ProtoPallet } from '../lib/entity/proto-pallet.entity';
import { clonarProtos } from '../lib/utils/clonar-utils';

const muestra: Array<Partial<ProtoPallet>> = [
  {
    id: 1,
    nombre: 'Standard Pallet',
    box: {
      id: 1,
      largo: 100.0,
      ancho: 120.0,
      alto: 170.0,
      volumen: 0,
      validate: () => true,
    },
  },
];
const resultado: Array<Partial<ProtoPallet>> = [
  {
    id: undefined,
    nombre: 'Standard Pallet',
    box: {
      id: undefined,
      largo: 100.0,
      ancho: 120.0,
      alto: 170.0,
      volumen: 0,
      validate: () => true,
    },
  },
];
describe('clonar los proto pallets', () => {
  it('deben quedar sin ids', () => {
    console.log('hello');
    expect(JSON.stringify(clonarProtos(muestra))).toEqual(
      JSON.stringify(resultado)
    );
  });
});
