import { EstadoLinea, ISuperOrden } from '@flash-ws/api-interfaces';

export class Totales {
  avance = 0;
  porEstadoConsolidada: Record<EstadoLinea, number> = {
    Nada: 0,
    Aprobada: 0,
    Rechazada: 0,
    Pendiente: 0,
    Multiple: 0,
  };
  porEstado: Record<EstadoLinea, number> = {
    Nada: 0,
    Aprobada: 0,
    Rechazada: 0,
    Pendiente: 0,
    Multiple: 0,
  };
  calcular() {
    if (this.so.lineas.length === 0) {
      this.avance = 0;
      return;
    }
    const nListas = this.so.lineas.reduce((acc, iter) => {
      this.porEstado[iter.estado]++;
      const lista =
        iter.estado === EstadoLinea.Aprobada ||
        iter.estado === EstadoLinea.Rechazada;
      return lista ? acc + 1 : acc;
    }, 0);
    this.so.lineasConsolidadas.forEach(
      (iter) => this.porEstadoConsolidada[iter.estado]++
    );

    this.avance = (100 * nListas) / this.so.lineas.length;
  }
  constructor(public so: ISuperOrden) {}
}
