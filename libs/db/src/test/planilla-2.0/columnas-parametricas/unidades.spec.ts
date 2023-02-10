import xlsx from 'node-xlsx';
import { ProcesadorPlanilla } from '../../../lib/parser-2.0/ProcesadorPlanilla';
import { LineBuilder, SheetBuilder } from './hoja-builder';
import { configCenco } from '../../../lib/parser-2.0/config-campos-cenco';

describe('configuración dinámica de campos', () => {
  it('Tiene una sóla unidad, Sisa', async () => {
    // Parse a file
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);
    const { unidades } = await procesador.procesar(ws[0]);
    expect(unidades.length).toBe(1);
    expect(unidades[0]).toBe('Sisa');
  });
  it('planilla con tres líneas, 2 unidades', async () => {
    const l1 = new LineBuilder().withUnidad('Sisa').build();
    const l2 = new LineBuilder().withUnidad('Sisa').build();
    const l3 = new LineBuilder().withUnidad('Jumbo').build();
    const hoja = new SheetBuilder().addLines(l1, l2, l3).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);

    expect(result.unidades.length).toBe(2);
    expect(result.unidades[0]).toBe('Sisa');
    expect(result.unidades[1]).toBe('Jumbo');
  });
});
