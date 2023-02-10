import { Token } from '../..';
import { dataSource } from '../data-source';

export class TokenService {
  async find(token: string): Promise<Token | null> {
    const t = await dataSource.getRepository(Token).findOne({
      where: { id: token },
      relations: ['usuario', 'usuario.empresa'],
    });
    return t;
  }
}
