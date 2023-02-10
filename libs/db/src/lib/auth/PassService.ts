import bcrypt from 'bcrypt';
export class PassService {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }
  async comparePassword(plain: string, hash: string) {
    const result = await bcrypt.compare(plain, hash);
    return result;
  }
}
