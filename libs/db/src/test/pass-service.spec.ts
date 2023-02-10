import { PassService } from '../lib/auth/PassService';

describe('password service', () => {
  describe('pass abc', () => {
    it('debe hashear la contraseña abc', async () => {
      const hash = await new PassService().hash('abc');
      expect(hash.length).toBeGreaterThan(32);
    });
    it('debe retornar ok con pass correcta', async () => {
      const hash = await new PassService().hash('abc');
      const isOk = await new PassService().comparePassword('abc', hash);
      expect(isOk).toBe(true);
    });
    it('debe error con pass incorrecta', async () => {
      const hash = await new PassService().hash('abc');
      const isOk = await new PassService().comparePassword('123', hash);
      expect(isOk).toBe(false);
    });
  });
});
