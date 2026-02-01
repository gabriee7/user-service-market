import request from 'supertest';
import express from 'express';
import { validateUser } from '#middlewares/userValidation.js';
import errorHandler from '#middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.post('/', validateUser, (req, res) => res.status(201).json({ ok: true }));
app.use(errorHandler);

describe('validateUser middleware', () => {
  it('deve retornar 400 para payload inválido', async () => {
    // Arrange
    const payload = {};
    // Action
    const res = await request(app).post('/').send(payload);
    // Assert
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve permitir payload válido', async () => {
    // Arrange
    const payload = { name: 'A', email: 'a@b.com', password: 'abcdef' };
    // Action
    const res = await request(app).post('/').send(payload);
    // Assert
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ ok: true });
  });
});