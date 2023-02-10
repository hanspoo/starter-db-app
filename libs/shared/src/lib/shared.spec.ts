import { so as rechazadas } from './ordenTodasRechazadas';
import { so as nada } from './ordenTodasNada';
import { EstadoLinea } from '@flash-ws/api-interfaces';
import { Totales } from './Totales';

describe('calcular avance sobre la interfaz de orden', () => {
  it('todas rechazadas avance 100', () => {
    const totales = new Totales(rechazadas);
    totales.calcular();
    expect(totales.avance).toEqual(100);
  });
  it('1 aceptada, 1 rechazada, resto nada avance 75%', () => {
    const custom = JSON.parse(JSON.stringify(nada));
    custom.lineas[0].estado = EstadoLinea.Aprobada;
    custom.lineas[1].estado = EstadoLinea.Rechazada;

    const totales = new Totales(custom);
    totales.calcular();
    expect(parseInt(totales.avance + '', 10)).toEqual(28);
  });
  it('1 aceptada, 1 rechazada, 7 nada', () => {
    const custom = JSON.parse(JSON.stringify(nada));
    custom.lineas[0].estado = EstadoLinea.Aprobada;
    custom.lineas[1].estado = EstadoLinea.Rechazada;

    const totales = new Totales(custom);
    totales.calcular();
    expect(totales.porEstado[EstadoLinea.Aprobada]).toBe(1);
    // expect(totales.porEstado[EstadoLinea.Rechazada]).toBe(1);
    // expect(totales.porEstado[EstadoLinea.Nada]).toBe(5);
  });
  it('todas rechazadas avance 0', () => {
    const totales = new Totales(nada);
    totales.calcular();
    expect(totales.avance).toEqual(0);
  });
  it('sin lineas avance 0', () => {
    const cero = { ...nada, lineas: [] };
    const totales = new Totales(cero);
    totales.calcular();
    expect(totales.avance).toEqual(0);
  });
});
