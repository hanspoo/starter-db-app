import { PassService } from "./auth/PassService";
import { dataSource } from "./data-source";
import { Empresa } from "./entity/auth/empresa.entity";
import { Usuario } from "./entity/auth/usuario.entity";

export async function inicializarSistema(): Promise<Empresa> {
  if (!dataSource.isInitialized) await dataSource.initialize();
  if (process.env["NODE_ENV"]?.startsWith("test")) {
    await dataSource.synchronize(true);
  }
  const repoEmpresa = dataSource.getRepository(Empresa);
  const e = await repoEmpresa.findOne({ where: { nombre: "myapp" } });
  if (e) {
    console.log(`Inicialización cancelada, empresa myapp ya existe`);
    return e;
  }

  const empresa = await crearEmpresa();

  return repoEmpresa.save(empresa);
}

export async function crearEmpresa(): Promise<Empresa> {
  const repoEmpresa = dataSource.getRepository(Empresa);
  const e = repoEmpresa.create({
    nombre: "myapp",
    identLegal: "76531540-9",
  });

  const user = dataSource.getRepository(Usuario).create({
    email: "admin@myapp.com",
    password: await new PassService().hash("123456"),
    nombre: "Admin",
  });

  e.usuarios = [user];

  return e;
}
