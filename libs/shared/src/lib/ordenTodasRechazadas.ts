import { ISuperOrden } from '@flash-ws/api-interfaces';
const x: any = {
  id: 1,
  numero: '5575426472',
  emision: '15-09-2022',
  entrega: '22-09-2022',
  lineas: [
    { estado: 'Rechazada', id: 1, cantidad: 1, productoId: 128, localId: 1 },
    { estado: 'Rechazada', id: 4, cantidad: 1, productoId: 128, localId: 4 },
    { estado: 'Rechazada', id: 3, cantidad: 1, productoId: 128, localId: 3 },
    { estado: 'Rechazada', id: 6, cantidad: 1, productoId: 127, localId: 6 },
    { estado: 'Rechazada', id: 7, cantidad: 1, productoId: 127, localId: 4 },
    { estado: 'Rechazada', id: 5, cantidad: 1, productoId: 127, localId: 5 },
    { estado: 'Rechazada', id: 2, cantidad: 1, productoId: 128, localId: 2 },
  ],
  unidad: {
    id: 2,
    nombre: 'Sisa',
    locales: [],
  },
  lineasConsolidadas: [],
};
const so = x as unknown as ISuperOrden;
export { so };
