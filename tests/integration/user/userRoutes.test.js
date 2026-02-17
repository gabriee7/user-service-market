import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import routes from '#routes/index.js';
import errorHandler from '#middlewares/errorHandler.js';
import userService from '#services/userService.js';
import { NotFoundException } from '#errors/index.js';

const app = express();
app.use(express.json());
app.use(routes);
app.use(errorHandler);

describe('User Routes', () => {
  beforeEach(() => jest.resetAllMocks());

  it('deve retornar 400 para payload inválido em POST /api/users', async () => {
    // Arrange
    const payload = {};
    // Action
    const res = await request(app).post('/api/users').send(payload);
    // Assert
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve criar usuário com sucesso em POST /api/users', async () => {
    // Arrange
    const dto = { name: 'Alice', email: 'a@example.com', password: 'secret' };
    const created = { id: 'u1', name: dto.name, email: dto.email, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    userService.create = jest.fn().mockResolvedValue(created);
    // Action
    const res = await request(app).post('/api/users').send(dto);
    // Assert
    expect(userService.create).toHaveBeenCalledWith(expect.objectContaining({ name: dto.name, email: dto.email, password: dto.password }));
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(created);
  });

  it('deve retornar lista de usuários em GET /api/users', async () => {
    // Arrange
    const rows = [{ id: 'u1', name: 'A', email: 'a@example.com' }];
    userService.getAll = jest.fn().mockResolvedValue(rows);
    // Action
    const res = await request(app).get('/api/users');
    // Assert
    expect(userService.getAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('deve retornar usuário por id em GET /api/users/:id', async () => {
    // Arrange
    const user = { id: 'u1', name: 'A', email: 'a@example.com' };
    userService.get = jest.fn().mockResolvedValue(user);
    // Action
    const res = await request(app).get('/api/users/u1');
    // Assert
    expect(userService.get).toHaveBeenCalledWith('u1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(user);
  });

  it('deve retornar 404 quando GET /api/users/:id não encontrar usuário', async () => {
    // Arrange
    userService.get = jest.fn().mockRejectedValue(new NotFoundException('User not found'));
    // Action
    const res = await request(app).get('/api/users/missing');
    // Assert
    expect(userService.get).toHaveBeenCalledWith('missing');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
