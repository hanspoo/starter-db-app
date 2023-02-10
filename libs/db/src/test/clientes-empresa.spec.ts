import { Repository } from 'typeorm';
import { dataSource } from '../lib/data-source';
import { Cliente } from '../lib/entity/cliente.entity';
import { Empresa } from '../lib/entity/auth/empresa.entity';

let cli1: Cliente, cli2: Cliente, cli3: Cliente, e1: Empresa, e2: Empresa;
let repoCli: Repository<Cliente>, repoEmpresa: Repository<Empresa>;

beforeAll(async () => {
  repoCli = dataSource.getRepository(Cliente);
  repoEmpresa = dataSource.getRepository(Empresa);
  if (!dataSource.isInitialized) await dataSource.initialize();
});
beforeEach(async () => {
  await repoEmpresa.query('delete from proto_pallet');
  await repoEmpresa.query('delete from token');
  await repoEmpresa.query('delete from usuario');
  await repoEmpresa.query('delete from cliente');
  await repoEmpresa.query('delete from empresa');
  cli1 = repoCli.create({ nombre: 'Europa', identLegal: '1-9' });
  cli2 = repoCli.create({ nombre: 'Europa', identLegal: '1-9' });
  cli3 = repoCli.create({ nombre: 'Calisto', identLegal: '2-7' });

  e1 = repoEmpresa.create({
    nombre: 'Jupiter',
    identLegal: '1-9',
    clientes: [],
  });
  e2 = repoEmpresa.create({
    nombre: 'Saturno',
    identLegal: '3-5',
    clientes: [],
  });
});

describe('cada empresa tiene sus propios clientes', () => {
  it('dos empresas diferentes pueden tener clientes con el mismo nombre', () => {
    e1.agregarCliente(cli1);
    e2.agregarCliente(cli2);
  });
  describe('la misma empresa', () => {
    it('debe lanzar excepción con dos clientes del mismo nombre', () => {
      const f = () => {
        e1.agregarCliente(cli1);
        e1.agregarCliente(cli2);
      };

      expect(f).toThrow();
    });
    it('debe lanzar excepción con dos clientes del mismo rut', () => {
      const f = () => {
        e1.agregarCliente(
          repoCli.create({ nombre: 'Europa 1', identLegal: 'abc' })
        );
        e1.agregarCliente(
          repoCli.create({ nombre: 'Europa 2', identLegal: 'abc' })
        );
      };

      expect(f).toThrow();
    });
    it('debe lanzar excepción con dos clientes del mismo nombre al salvar', async () => {
      const f = async () => {
        e1.clientes.push(cli1);
        e1.clientes.push(cli2);
        await repoEmpresa.save(e1);
      };

      expect(f()).rejects.toThrow();
    });
    it('no debe lanzar excepción con dos clientes nombre distinto al salvar', async () => {
      e1.clientes.push(cli1);
      e1.clientes.push(cli3);
      await repoEmpresa.save(e1);
    });
    it('debe pasar bien con dos clientes distinto nombre', () => {
      //   const e2 = await repoEmpresa.save(repoEmpresa.create({ nombre: 'Orion' }));

      e1.agregarCliente(cli1);
      e1.agregarCliente(cli3);
    });
  });
});
// ('el mismo rut y nombre de cliente puede estar en varias empresas');
// ('el mismo rut y nombre deben ser únicos en la misma empresa');
