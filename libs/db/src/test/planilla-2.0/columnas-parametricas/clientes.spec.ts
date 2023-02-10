import xlsx from 'node-xlsx';

import { ProcesadorPlanilla } from '../../../lib/parser-2.0/ProcesadorPlanilla';
import { configCenco } from '../../../lib/parser-2.0/config-campos-cenco';

import { LineBuilder, SheetBuilder } from './hoja-builder';
import { FieldsMapper } from '../../../lib/entity/campos/FieldsMapper';
import { Campo } from '@flash-ws/api-interfaces';

describe('configuración dinámica de campos', () => {
  it('debe permitir agregar campo', async () => {
    const config = FieldsMapper.from('Gargola S.A.');
    expect(config.nombre).toBe('Gargola S.A.');

    config.addCampo(Campo.NOMBRE_CLIENTE, 0);
    expect(config.campos[0].campo).toBe(Campo.NOMBRE_CLIENTE);
    expect(config.campos[0].columna).toBe(0);
  });

  it('debe lograr cargar el archivo', async () => {
    // Parse a file
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);
    // console.log(ws[0]);

    expect(ws).toBeTruthy();
  });
  it('Tiene un sólo cliente RUT C001', async () => {
    // Parse a file
    const ws = xlsx.parse(`fixtures/orden-una-linea.xls`);

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(ws[0]);
    expect(result.clientes.length).toBe(1);
    expect(result.clientes[0].identLegal).toBe('C001');
  });
  it('una hoja con RUT 76531540-9', async () => {
    const line = new LineBuilder().withIdentLegal('76531540-9').build();
    const hoja = new SheetBuilder().addLine(line).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);
    expect(result.clientes[0].identLegal).toBe('76531540-9');
  });
  it('planilla con dos clientes', async () => {
    const l1 = new LineBuilder().withIdentLegal('C001').build();
    const l2 = new LineBuilder().withIdentLegal('76531540-9').build();
    const hoja = new SheetBuilder().addLine(l1).addLine(l2).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);

    expect(result.clientes[0].identLegal).toBe('C001');
    expect(result.clientes[1].identLegal).toBe('76531540-9');
  });

  it('planilla varias lineas mismo cliente da lo mismo', async () => {
    const l1 = new LineBuilder().withIdentLegal('C001').build();
    const l2 = new LineBuilder().withIdentLegal('C001').build();
    const l3 = new LineBuilder().withIdentLegal('C001').build();
    const l4 = new LineBuilder().withIdentLegal('76531540-9').build();
    const l5 = new LineBuilder().withIdentLegal('76531540-9').build();
    const l6 = new LineBuilder().withIdentLegal('76531540-9').build();
    const hoja = new SheetBuilder().addLines(l1, l2, l3, l4, l5, l6).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);

    expect(result.clientes[0].identLegal).toBe('C001');
    expect(result.clientes[1].identLegal).toBe('76531540-9');
  });
});

describe('crea cliente', () => {
  it('cliente debe tener nombre y rut de la planilla', async () => {
    const line = new LineBuilder()
      .withIdentLegal('76531540-9')
      .withNombre('Paraiso Ltda')
      .build();
    const hoja = new SheetBuilder().addLine(line).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);
    expect(result.clientes[0].identLegal).toBe('76531540-9');
    expect(result.clientes[0].nombre).toBe('Paraiso Ltda');
  });
  it('dos clientes con tener nombre e ident legal', async () => {
    const l1 = new LineBuilder()
      .withIdentLegal('1-9')
      .withNombre('El primer cliente')
      .build();
    const l2 = new LineBuilder()
      .withIdentLegal('76531540-9')
      .withNombre('Paraiso Ltda')
      .build();
    const hoja = new SheetBuilder().addLines(l1, l2).build();

    const procesador = new ProcesadorPlanilla(configCenco);
    const result = await procesador.procesar(hoja);

    expect(result.clientes[0].identLegal).toBe('1-9');
    expect(result.clientes[0].nombre).toBe('El primer cliente');

    expect(result.clientes[1].identLegal).toBe('76531540-9');
    expect(result.clientes[1].nombre).toBe('Paraiso Ltda');
  });
});
