import {
  ActivationRequest,
  ActivationResponse,
} from '@flash-ws/api-interfaces';
import { inicializarSistema } from '@flash-ws/db';
import request from 'supertest';
import { app } from '../../app';

beforeAll(inicializarSistema);

const bodyReq: ActivationRequest = {
  cseg: 123456,
  email: 'info@myapp.com',
};
describe('servicio activacion registro usuarios', () => {
  it('existe el endpoint', async () => {
    const res = await request(app).post('/api/auth/activate').send(bodyReq);
    expect(res.statusCode).toEqual(200);
    const bodyRes: ActivationResponse = res.body;
    expect(bodyRes.msg).toContain('REG001');
  });
});
