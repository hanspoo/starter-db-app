import xlsx from 'node-xlsx';
import { ProcesadorPlanilla } from '../../../lib/parser-2.0/ProcesadorPlanilla';
import { configCenco } from '../../../lib/parser-2.0/config-campos-cenco';
import { LineBuilder, SheetBuilder } from './hoja-builder';

describe('configuración dinámica de campos', () => {
  it('Tiene un sóla local: Sisa', async () => {
    // Parse a file
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);
    const { locales } = await procesador.procesar(ws[0]);
    expect(locales.length).toBe(1);
    expect(locales[0].codigo).toBe('N524');
    expect(locales[0].nombre).toBe('Sisa Linares Januario Esp');
  });
  it('planilla con tres líneas, 2 locales', async () => {
    const l1 = new LineBuilder().withLocal('N641,CD LO AGUIRRE').build();
    const l2 = new LineBuilder().withLocal('N641,CD LO AGUIRRE').build();
    const l3 = new LineBuilder().withLocal('ABC,Abecedario').build();
    const hoja = new SheetBuilder().addLines(l1, l2, l3).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);

    expect(result.locales.length).toBe(2);
  });
  it('1 local rescata los datos', async () => {
    const l1 = new LineBuilder().withLocal('N641,CD LO AGUIRRE').build();
    const hoja = new SheetBuilder().addLines(l1).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);

    expect(result.locales[0].codigo).toBe('N641');
    expect(result.locales[0].nombre).toBe('Cd Lo Aguirre');
  });
  it('agrega nombre de unidad de negocio', async () => {
    const l1 = new LineBuilder()
      .withUnidad('Sisa')
      .withLocal('N641,CD LO AGUIRRE')
      .build();
    const hoja = new SheetBuilder().addLines(l1).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);

    expect(result.locales[0].codigo).toBe('N641');
    expect(result.locales[0].nombre).toBe('Cd Lo Aguirre');
    expect(result.locales[0].unidad).toBe('Sisa');
  });
});
