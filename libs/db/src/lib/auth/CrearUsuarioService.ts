import { dataSource } from "../data-source";
import { Empresa } from "../entity/auth/empresa.entity";
import { SolicitudRegistro } from "../entity/auth/solicitud-registro.entity";
import { Usuario } from "../entity/auth/usuario.entity";
import { PassService } from "./PassService";

export class CrearUsuarioService {
  empresa: string;
  nombre: string;
  email: string;
  password: string;
  identLegal: string;

  async crearDesdeSolicitud(s: SolicitudRegistro): Promise<Empresa> {
    this.empresa = s.empresa;
    this.nombre = s.nombre;
    this.email = s.email;
    this.password = s.password;
    this.identLegal = s.identLegal;

    return this.execute();
  }
  async execute(): Promise<Empresa> {
    const repoEmpresa = dataSource.getRepository(Empresa);

    const e = await repoEmpresa.save(
      repoEmpresa.create({
        identLegal: this.identLegal,
        nombre: this.empresa,
      })
    );

    const user = dataSource.getRepository(Usuario).create({
      nombre: this.nombre,
      email: this.email,
      password: await new PassService().hash(this.password),
      esAdmin: true,
    });

    e.usuarios = [user];

    return await repoEmpresa.save(e);
  }

  async validate(): Promise<[boolean, Array<string>]> {
    const errors: Array<string> = [];
    if (!/\w+/.test(this.empresa)) errors.push("Empresa inválida");
    if (!/\w+/.test(this.identLegal)) errors.push("Ident legal inválido");
    if (!/\w+/.test(this.nombre)) errors.push("Nombre inválido");
    if (!/\w+/.test(this.email)) errors.push("Email inválido");
    if (!/\w+/.test(this.password)) errors.push("Contraseña inválida");
    if (errors.length > 0) return [false, errors];

    return [true, []];
  }
}
