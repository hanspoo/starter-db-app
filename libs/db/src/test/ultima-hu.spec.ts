import { dataSource } from '../lib/data-source';
import { Empresa } from '../lib/entity/auth/empresa.entity';
import { OrdenCompra } from '../lib/entity/orden-compra.entity';
import { Pallet } from '../lib/entity/pallet.entity';
import { inicializarCencosud } from '../lib/inicializarCencosud';
import { ServicioPallets } from '../lib/ServicioPallets';
import { crearOrdenHelper } from '../lib/utils/crearOrdenHelper';

let orden: OrdenCompra;

beforeAll(async () => {
  await inicializarCencosud();
});
beforeEach(async () => {
  await dataSource.query('delete from pallet');
  await dataSource.getRepository(OrdenCompra).clear();
  orden = await crearOrdenHelper(1);
});
async function insertarPallet(hu: number, orden: OrdenCompra) {
  const p = new Pallet();
  p.hu = hu;
  p.ordenCompra = orden;
  p.local = orden.lineas[0].local;
  // console.log(p);

  return dataSource.getRepository(Pallet).save(p);
}

describe('ultima hu', () => {
  it('sin pallets, retorna 0', async () => {
    const s = new ServicioPallets();
    const hu = await s.ultimaHU();
    expect(hu).toBe(0);
  });
  it('un pallet con hu 1, retorna 1', async () => {
    await insertarPallet(1, orden);
    const s = new ServicioPallets();
    const hu = await s.ultimaHU();
    expect(hu).toBe(1);
  });
  it('lanza excepción con hu duplicada', async () => {
    async function f() {
      await insertarPallet(1, orden);
      await insertarPallet(1, orden);
    }

    expect(f()).rejects.toThrow();
  });
  it.skip('sin exception con hu diferente', async () => {
    const pallets = await dataSource.getRepository(Pallet).find({});
    expect(pallets.length).toBe(0);
    await insertarPallet(1, orden);
    await insertarPallet(2, orden);
  });
});

describe.skip('hu separadas por empresa', () => {
  describe('dos empresas nuevas', () => {
    it('insertamos un pallet en cada, el next hu para cada una debe ser 2', async () => {
      const e1 = await new EmpresaBuilder().build();
      const o1 = await new OrdenBuilder().conEmpresa(e1).build();
      const pallet = await new PalletBuilder().conOrden(o1).build();
      expect(pallet.hu).toBe(1);
    });
  });
});

const repoPallet = dataSource.getRepository(Pallet);
class PalletBuilder {
  orden: OrdenCompra;
  async build() {
    const pallet = new Pallet();
    repoPallet.save(pallet);
    return pallet;
  }
  conOrden(orden: OrdenCompra) {
    this.orden = orden;
    return this;
  }
}
const repoOrden = dataSource.getRepository(OrdenCompra);
class OrdenBuilder {
  empresa: Empresa;
  async build() {
    const orden = repoOrden.create({
      numero: '1',
      emision: '01-01-2000',
      entrega: '12-01-2000',
    });
    repoOrden.save(orden);
    return orden;
  }
  conEmpresa(e: Empresa) {
    this.empresa = e;
    return this;
  }
}
const repoEmpresa = dataSource.getRepository(Empresa);
class EmpresaBuilder {
  async build() {
    const e = new Empresa();
    repoEmpresa.save(e);
    return e;
  }
}
