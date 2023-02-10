import { dataSource } from '../data-source';
import { Usuario } from '../entity/auth/usuario.entity';
import { PassService } from './PassService';

export class CredentialsService {
  async validate(
    email: string,
    password: string
  ): Promise<[boolean, string | Usuario]> {
    email = email.trim().toLowerCase();
    const u = await dataSource
      .getRepository(Usuario)
      .findOne({ where: { email } });

    if (u === null) return [false, 'Usuario no existe'];

    const service = new PassService();
    const isOk = await service.comparePassword(password.trim(), u.password);

    if (isOk) {
      return [true, u];
    } else {
      return [false, 'Contraseña incorrecta'];
    }
  }
}
