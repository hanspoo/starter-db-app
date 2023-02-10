import { Campo, TipoPlanilla } from '@flash-ws/api-interfaces';
import { PassService } from './auth/PassService';
import { dataSource } from './data-source';
import { Empresa } from './entity/auth/empresa.entity';
import { Usuario } from './entity/auth/usuario.entity';
import { Box } from './entity/box.entity';
import { FieldsMapper } from './entity/campos/FieldsMapper';
import { Producto } from './entity/producto.entity';
import { ProtoPallet } from './entity/proto-pallet.entity';

function mapaCenco(): FieldsMapper {
  const mapper = dataSource.getRepository(FieldsMapper).create({
    nombre: 'Campos en b2b Cencosud Estándar',
    campos: [],
    tipo: TipoPlanilla.B2B,
  });

  mapper.addCampo(Campo.IDENT_LEGAL, 3);
  mapper.addCampo(Campo.NOMBRE_CLIENTE, 4);
  mapper.addCampo(Campo.UNIDAD_NEGOCIO, 37);

  mapper.addCampo(Campo.COD_LOCAL, 13);
  mapper.addCampo(Campo.NOMBRE_LOCAL, 14);

  mapper.addCampo(Campo.COD_CENCOSUD, 16);
  mapper.addCampo(Campo.COD_PRODUCTO, 17);
  mapper.addCampo(Campo.CANTIDAD, 23);

  mapper.addCampo(Campo.NUM_ORDEN, 1);
  mapper.addCampo(Campo.FEC_EMISION, 7);
  mapper.addCampo(Campo.FEC_ENTREGA, 8);

  return mapper;
}

export async function inicializarSistema(): Promise<Empresa> {
  if (!dataSource.isInitialized) await dataSource.initialize();
  if (process.env['NODE_ENV']?.startsWith('test')) {
    await dataSource.synchronize(true);
  }
  const repoEmpresa = dataSource.getRepository(Empresa);
  const e = await repoEmpresa.findOne({ where: { nombre: 'myapp' } });
  if (e) {
    console.log(`Inicialización cancelada, empresa myapp ya existe`);
    return e;
  }

  const empresa = await crearEmpresa();
  const protoPallet = await crearProtoPallet();
  empresa.protoPallets = [protoPallet];
  const fm = mapaCenco();
  fm.empresa = empresa;

  empresa.fieldMappers = [fm];

  return repoEmpresa.save(empresa);
}
export async function crearProtoPallet() {
  const p = new ProtoPallet();
  p.box = Box.from({ largo: 100, ancho: 120, alto: 170 });
  p.nombre = 'Standard Pallet';

  return p;
}

export async function crearEmpresa(): Promise<Empresa> {
  const repoEmpresa = dataSource.getRepository(Empresa);
  const e = repoEmpresa.create({
    nombre: 'myapp',
    identLegal: '76531540-9',
  });

  const user = dataSource.getRepository(Usuario).create({
    email: 'admin@myapp.com',
    password: await new PassService().hash('123456'),
    nombre: 'Admin',
  });

  e.usuarios = [user];

  return e;
}

export async function crearProductoPrueba() {
  const empresas = await dataSource.getRepository(Empresa).find();
  const data = {
    id: 1,
    nombre: 'Producto de prueba',
    codigo: 'DRBIO-00634',
    peso: 1,
    codCenco: '1647753',
    vigente: true,
    box: { id: 1, largo: 1.0, ancho: 1.0, alto: 1.0 },
    empresa: empresas[0],
  };
  const repo = dataSource.getRepository(Producto);
  await repo.save(repo.create(data));
}
