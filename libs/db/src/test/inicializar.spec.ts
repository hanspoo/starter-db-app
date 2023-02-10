import { dataSource } from '../lib/data-source';
import { inicializarSistema } from '../lib/inicializarSistema';

beforeEach(async () => {
  if (!dataSource.isInitialized) await dataSource.initialize();
  await dataSource.query('delete from field_map');
  await dataSource.query('delete from fields_mapper');
  await dataSource.query('delete from usuario');
  await dataSource.query('delete from producto');
  await dataSource.query('delete from proto_pallet');
  await dataSource.query('delete from empresa');
  // await dataSource.getRepository(Usuario).clear();
  // await dataSource.getRepository(ProtoPallet).clear();
  // await dataSource.getRepository(Empresa).clear();
});
describe('inicializar sistema', () => {
  it('debe crear empresa', async () => {
    const e = await inicializarSistema();
    expect(e).toBeTruthy();
  });
  it('empresa tiene proto pallet', async () => {
    const e = await inicializarSistema();
    expect(e.protoPallets.length).toBeGreaterThan(0);
  });
  it('empresa tiene usuarios', async () => {
    const e = await inicializarSistema();
    expect(e.usuarios.length).toBeGreaterThan(0);
  });
});
