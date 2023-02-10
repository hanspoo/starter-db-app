// Antes de comenzar las pruebas el cliente y sus unidades de negocio están creadas

import { dataSource } from '../lib/data-source';
import { Cliente } from '../lib/entity/cliente.entity';
import { Local } from '../lib/entity/local.entity';
import { inicializarCencosud } from '../lib/inicializarCencosud';
import { UnidadNegocio } from '../lib/entity/unidad-negocio.entity';

let cliente: Cliente;

beforeAll(async () => {
  cliente = await inicializarCencosud();
});
beforeEach(async () => {
  await dataSource.getRepository(Local).clear();
});

describe('Prueba fixture local', () => {
  it('Crea cencosud', () => {
    expect(cliente).toBeTruthy();
  });
  it('Crea las dos unidades haciendo save en cascada', () => {
    expect(cliente.unidades.length).toBe(2);
  });
  it('Las unidades quedan referenciando el cliente', () => {
    expect(cliente.unidades[0].cliente).toBe(cliente);
  });
});

describe('agrega locales', () => {
  it('agrega un local', () => {
    const local = new Local();
    local.codigo = 'j1';
    local.nombre = 'Jumbo Tobalaba';

    const unidad = cliente.unidades[0];
    unidad.locales = [local];
  });
  it('agrega dos locales', async () => {
    const j1 = new Local();
    j1.codigo = 'j1';
    j1.nombre = 'Jumbo Tobalaba 1';

    const j2 = new Local();
    j2.codigo = 'j2';
    j2.nombre = 'Jumbo Tobalaba 2';

    const unidad = cliente.unidades[0];
    unidad.locales = [j1, j2];
    await dataSource.getRepository(UnidadNegocio).save(unidad);

    expect(unidad.locales.length).toBe(2);
  });
  it('agrega dos usando push', async () => {
    const j1 = new Local();
    j1.codigo = 'j1';
    j1.nombre = 'Jumbo Tobalaba 1';

    const unidad = cliente.unidades[0];
    unidad.locales = [j1];
    await dataSource.getRepository(UnidadNegocio).save(unidad);

    expect(unidad.locales.length).toBe(1);

    const j2 = new Local();
    j2.codigo = 'j2';
    j2.nombre = 'Jumbo Tobalaba 2';

    unidad.locales.push(j2);
    await dataSource.getRepository(UnidadNegocio).save(unidad);
    expect(unidad.locales.length).toBe(2);
  });
});
