import { dataSource } from './data-source';
import { Cliente } from './entity/cliente.entity';
import { UnidadNegocio } from './entity/unidad-negocio.entity';
import { Producto } from './entity/producto.entity';
import { Box } from './entity/box.entity';
import { Empresa } from './entity/auth/empresa.entity';
import e from 'express';
import { Usuario } from './entity/auth/usuario.entity';
import { LoginService } from './auth/LoginService';
import { ProtoPallet } from './entity/proto-pallet.entity';
import { PassService } from './auth/PassService';
import { TipoPlanilla, Campo } from '@flash-ws/api-interfaces';
import { FieldsMapper } from './entity/campos/FieldsMapper';

export const obtainToken = async () => {
  const [isOk, token] = await new LoginService().login(
    'admin@myapp.com',
    '123456'
  );
  if (!isOk) throw Error('Error de fake login en test no ok');
  if (!token) throw Error('Error de fake login en test token invalido');
  return token;
};

export const CODIGO_PROD = 'DRBIO-00634';
export const PRODUCTO_CENCO_TEST = '1647753';

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

export async function inicializarCencosud(): Promise<Cliente> {
  if (!dataSource.isInitialized) await dataSource.initialize();
  const repoEmpresa = dataSource.getRepository(Empresa);
  const repoCliente = dataSource.getRepository(Cliente);
  const clientes = await repoCliente.find({});
  if (clientes.length > 0) {
    console.log('cancelando inicialización de cencosud, ya hay datos');

    return clientes[0];
  }
  // const entities = dataSource.entityMetadatas;

  // for (const entity of entities) {
  //   const repository = dataSource.getRepository(entity.name); // Get repository
  //   await repository.clear(); // Clear each entity table's content
  // }

  const cliente = new Cliente();
  cliente.unidades = [
    crearUnidad(cliente, 'Jumbo'),
    crearUnidad(cliente, 'Sisa'),
  ];
  cliente.nombre = 'Cencosud';
  cliente.identLegal = '13297015-7';

  const producto = new Producto();
  producto.box = new Box();
  producto.box.largo = 1;
  producto.box.ancho = 1;
  producto.box.alto = 1;
  producto.codCenco = PRODUCTO_CENCO_TEST;
  producto.nombre = 'Producto de prueba';
  producto.peso = 1;
  producto.vigente = true;
  producto.codigo = CODIGO_PROD;

  // await repoProducto.save(p);

  const repoProto = dataSource.getRepository(ProtoPallet);
  const e = await repoEmpresa.save(
    repoEmpresa.create({
      nombre: 'myapp',
      identLegal: '76531540-9',
      fieldMappers: [mapaCenco()],
    })
  );

  const user = dataSource.getRepository(Usuario).create({
    email: 'admin@myapp.com',
    password: await new PassService().hash('123456'),
    nombre: 'Usuario de prueba',
  });

  e.clientes = [cliente];
  e.productos = [producto];
  e.usuarios = [user];

  const proto = {
    nombre: 'Standard Pallet',
    box: {
      largo: 100.0,
      ancho: 120.0,
      alto: 170.0,
    },
  };

  e.protoPallets = [repoProto.create(proto)];

  const eok = await repoEmpresa.save(e);

  return cliente;
}

function crearUnidad(c: Cliente, nombre: string) {
  const u = new UnidadNegocio();
  u.nombre = nombre;
  u.cliente = c;
  u.locales = [];
  u.ordenes = [];
  return u;
}
