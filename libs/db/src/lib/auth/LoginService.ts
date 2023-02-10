import { dataSource } from '../data-source';
import { Token } from '../entity/auth/token.entity';
import { CredentialsService } from './CredentialsService';

export class LoginService {
  async login(email: string, pass: string): Promise<[boolean, string]> {
    const [connected, payloadResponse] =
      await new CredentialsService().validate(email, pass);
    if (connected && typeof payloadResponse !== 'string') {
      const t = Token.fromUsuario(payloadResponse);
      const token = await dataSource.getRepository(Token).save(t);
      return [true, token.id];
    } else {
      if (typeof payloadResponse !== 'string')
        throw Error('El mensaje debe ser string');
      return [false, payloadResponse];
    }
  }
}
