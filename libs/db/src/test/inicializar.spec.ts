import { dataSource } from "../lib/data-source";
import { inicializarSistema } from "../lib/inicializarSistema";

beforeEach(async () => {
  if (!dataSource.isInitialized) await dataSource.initialize();
  await dataSource.query("delete from usuario");
  await dataSource.query("delete from empresa");
});
describe("inicializar sistema", () => {
  it("debe crear empresa", async () => {
    const e = await inicializarSistema();
    expect(e).toBeTruthy();
  });
  it("empresa tiene usuarios", async () => {
    const e = await inicializarSistema();
    expect(e.usuarios.length).toBeGreaterThan(0);
  });
});
