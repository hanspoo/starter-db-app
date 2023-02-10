import xlsx from 'node-xlsx';
import { ProcesadorPlanilla } from '../../../lib/parser-2.0/ProcesadorPlanilla';
import { configCenco } from '../../../lib/parser-2.0/config-campos-cenco';

describe('configuración dinámica de campos', () => {
  it('Tiene una sóla línea', async () => {
    // Parse a file
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);
    const { lineas } = await procesador.procesar(ws[0]);
    expect(lineas.length).toBe(1);
  });
  it('Captura bien datos de la línea', async () => {
    // Parse a file
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);
    const { lineas } = await procesador.procesar(ws[0]);

    expect(lineas[0].cantidad).toBe(1);
    expect(lineas[0].codLocal).toBe('N524');
    expect(lineas[0].codProdCliente).toBe('1647753');
    expect(lineas[0].codProducto).toBe('DRBIO-00634');
  });
  it('La línea trae el # de orden bien datos de la línea', async () => {
    // Parse a file
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);
    const { lineas } = await procesador.procesar(ws[0]);

    expect(lineas[0].numOrden).toBe('5575426472');
  });
});
