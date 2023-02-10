import { LoginRequest } from '@flash-ws/api-interfaces';
import { inicializarCencosud } from '@flash-ws/db';
import request from 'supertest';
import { app } from '../../app';

beforeAll(async () => {
  await inicializarCencosud();
});

describe('servicio me', () => {
  it('debe entregar 401 no autorizado sin token', async () => {
    const response = await request(app).get('/api/me');
    expect(response.status).toBe(401);
  });
  it('debe entregar 200 cuando hay token', async () => {
    const token = await logear();
    const response = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it('debe entregar datos de usuario cuando hay token', async () => {
    const token = await logear();
    const response = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      nombre: 'Usuario de prueba',
      email: 'admin@myapp.com',
      empresa: 'myapp',
    });
  });
});

async function logear() {
  const credentials: LoginRequest = {
    email: 'admin@myapp.com',
    password: '123456',
  };
  const loginResult = await request(app)
    .post('/api/auth/login')
    .send(credentials);

  return loginResult.headers['x-token'];
}
