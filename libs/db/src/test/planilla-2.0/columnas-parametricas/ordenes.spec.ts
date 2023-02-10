import xlsx from 'node-xlsx';
import { ProcesadorPlanilla } from '../../../lib/parser-2.0/ProcesadorPlanilla';
import { configCenco } from '../../../lib/parser-2.0/config-campos-cenco';

describe('configuración dinámica de campos', () => {
  it('Tiene una sóla orden', async () => {
    // Parse a file
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);
    expect(result.ordenes.length).toBe(1);
    expect(result.ordenes[0].numero).toBe('5575426472');
    expect(result.ordenes[0].emision).toBe('15-09-2022');
    expect(result.ordenes[0].entrega).toBe('22-09-2022');
  });
});
