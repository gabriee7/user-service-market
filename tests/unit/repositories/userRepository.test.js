import { jest } from '@jest/globals';
import pool from '#config/database.js';
import userRepository from '#repositories/userRepository.js';

describe('userRepository', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const makeRow = (overrides = {}) => ({
    id: overrides.id || 'u1',
    name: overrides.name || 'Alice',
    email: overrides.email || 'alice@example.com',
    password: overrides.password || 'hashed',
    created_at: overrides.created_at || new Date('2026-01-01T00:00:00.000Z'),
    updated_at: overrides.updated_at || new Date('2026-01-02T00:00:00.000Z')
  });

  it('deve inserir e retornar o usuário criado (create)', async () => {
    // Arrange
    const row = makeRow({ id: 'new-id' });
    pool.execute = jest.fn()
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[row]]);
    // Action
    const res = await userRepository.create({ id: row.id, name: row.name, email: row.email, password: row.password });
    // Assert
    expect(pool.execute).toHaveBeenCalledTimes(2);
    expect(pool.execute.mock.calls[0][0]).toMatch(/INSERT INTO users/i);
    expect(pool.execute.mock.calls[0][1]).toEqual([row.id, row.name, row.email, row.password]);
    expect(pool.execute.mock.calls[1][0]).toMatch(/SELECT \* FROM users WHERE id = \?/i);
    expect(res).toEqual(row);
  });

  it('deve buscar usuário por email (findByEmail/getByEmail) e retornar null quando não encontrado', async () => {
    // Arrange
    const row = makeRow();
    pool.execute = jest.fn().mockResolvedValueOnce([[row]]);
    // Action
    const found = await userRepository.findByEmail(row.email);
    // Assert
    expect(pool.execute).toHaveBeenCalledWith(expect.stringMatching(/SELECT \* FROM users WHERE email = \?/i), [row.email]);
    expect(found).toEqual(row);
    pool.execute = jest.fn().mockResolvedValueOnce([[]]);
    const notFound = await userRepository.getByEmail('nope@example.com');
    expect(notFound).toBeNull();
  });

  it('deve buscar usuário por id (getById) e retornar null quando não encontrado', async () => {
    // Arrange
    const row = makeRow({ id: 'u-123' });
    pool.execute = jest.fn().mockResolvedValueOnce([[row]]);
    // Action
    const found = await userRepository.getById('u-123');
    // Assert
    expect(pool.execute).toHaveBeenCalledWith(expect.stringMatching(/SELECT \* FROM users WHERE id = \?/i), ['u-123']);
    expect(found).toEqual(row);
    pool.execute = jest.fn().mockResolvedValueOnce([[]]);
    const missing = await userRepository.getById('missing');
    expect(missing).toBeNull();
  });

  it('deve retornar todos os usuários (getAll)', async () => {
    // Arrange
    const rows = [makeRow({ id: 'a' }), makeRow({ id: 'b', email: 'b@example.com' })];
    pool.execute = jest.fn().mockResolvedValueOnce([rows]);
    // Action
    const res = await userRepository.getAll();
    // Assert
    expect(pool.execute).toHaveBeenCalledWith(expect.stringMatching(/SELECT \* FROM users/i));
    expect(res).toEqual(rows);
  });

  it('deve atualizar e retornar usuário atualizado (update)', async () => {
    // Arrange
    const updated = makeRow({ id: 'u-upd', name: 'Updated' });
    pool.execute = jest.fn()
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[updated]]);
    // Action
    const res = await userRepository.update('u-upd', { name: 'Updated', email: updated.email, password: updated.password });
    // Assert
    expect(pool.execute).toHaveBeenCalledTimes(2);
    expect(pool.execute.mock.calls[0][0]).toMatch(/UPDATE users SET name = \?, email = \?, password = \? WHERE id = \?/i);
    expect(pool.execute.mock.calls[0][1]).toEqual([updated.name, updated.email, updated.password, 'u-upd']);
    expect(res).toEqual(updated);
  });

  it('deve deletar usuário (delete) chamando o SQL correto', async () => {
    // Arrange
    pool.execute = jest.fn().mockResolvedValueOnce([{}]);
    // Action
    const res = await userRepository.delete('to-del');
    // Assert
    expect(pool.execute).toHaveBeenCalledWith(expect.stringMatching(/DELETE FROM users WHERE id = \?/i), ['to-del']);
    expect(res).toBeUndefined();
  });
});
