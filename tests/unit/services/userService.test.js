import userService from '#services/userService.js';
import userRepository from '#repositories/userRepository.js';
import { jest } from '@jest/globals';

describe('userService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const makeDbRow = (overrides = {}) => ({
    id: overrides.id || 'id-1',
    name: overrides.name || 'Alice',
    email: overrides.email || 'alice@example.com',
    password: overrides.password || 'hashed',
    created_at: overrides.created_at || new Date('2026-01-01T00:00:00.000Z'),
    updated_at: overrides.updated_at || new Date('2026-01-02T00:00:00.000Z')
  });

  it('deve criar um usuário com sucesso', async () => {
    // Arrange
    const dto = { name: 'Alice', email: 'alice@example.com', password: 'secret' };
    userRepository.getByEmail = jest.fn().mockResolvedValue(undefined);
    userRepository.create = jest.fn().mockImplementation(async ({ id, name, email }) =>
      makeDbRow({ id, name, email })
    );
    // Action
    const res = await userService.create(dto);
    // Assert
    expect(userRepository.getByEmail).toHaveBeenCalledWith(dto.email);
    expect(userRepository.create).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
    expect(res.name).toBe(dto.name);
    expect(res.email).toBe(dto.email);
    expect(res).toHaveProperty('createdAt');
    expect(res).toHaveProperty('updatedAt');
  });

  it('não deve criar usuário quando email já existe', async () => {
    // Arrange
    const dto = { name: 'Bob', email: 'bob@example.com', password: 'secret' };
    userRepository.getByEmail = jest.fn().mockResolvedValue(makeDbRow({ email: dto.email }));
    // Action & Assert
    await expect(userService.create(dto)).rejects.toThrow('Email already in use');
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('deve retornar usuário por id', async () => {
    // Arrange
    const row = makeDbRow({ id: 'u-1' });
    userRepository.getById = jest.fn().mockResolvedValue(row);
    // Action
    const res = await userService.get('u-1');
    // Assert
    expect(userRepository.getById).toHaveBeenCalledWith('u-1');
    expect(res.id).toBe('u-1');
    expect(res.email).toBe(row.email);
  });

  it('não deve retornar usuário inexistente', async () => {
    // Arrange
    userRepository.getById = jest.fn().mockResolvedValue(undefined);
    // Action & Assert
    await expect(userService.get('not-found')).rejects.toThrow('User not found');
  });

  it('deve retornar todos os usuários (lista não vazia)', async () => {
    // Arrange
    const rows = [makeDbRow({ id: 'u1' }), makeDbRow({ id: 'u2', email: 'b@example.com' })];
    userRepository.getAll = jest.fn().mockResolvedValue(rows);
    // Action
    const res = await userService.getAll();
    // Assert
    expect(userRepository.getAll).toHaveBeenCalled();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(2);
  });

  it('deve retornar lista vazia quando não houver usuários', async () => {
    // Arrange
    userRepository.getAll = jest.fn().mockResolvedValue([]);
    // Action
    const res = await userService.getAll();
    // Assert
    expect(res).toEqual([]);
  });

  it('deve atualizar um usuário com sucesso', async () => {
    // Arrange
    const existing = makeDbRow({ id: 'u-update', email: 'old@example.com', password: 'oldhash' });
    userRepository.getById = jest.fn().mockResolvedValue(existing);
    userRepository.getByEmail = jest.fn().mockResolvedValue(undefined);
    userRepository.update = jest.fn().mockImplementation(async (id, data) =>
      makeDbRow({ id, name: data.name, email: data.email })
    );
    // Action
    const res = await userService.update('u-update', 
      { 
        name: 'New Name',
        email: 'new@example.com',
        password: 'newpass'
      }
    );
    // Assert
    expect(userRepository.getById).toHaveBeenCalledWith('u-update');
    expect(userRepository.update).toHaveBeenCalledWith('u-update', expect.any(Object));
    expect(res.name).toBe('New Name');
    expect(res.email).toBe('new@example.com');
  });

  it('não deve atualizar usuário inexistente', async () => {
    // Arrange
    userRepository.getById = jest.fn().mockResolvedValue(undefined);
    // Action & Assert
    await expect(userService.update('missing', { name: 'X' })).rejects.toThrow('User not found');
  });

  it('não deve atualizar usuário quando novo email já pertence a outro', async () => {
    // Arrange
    const existing = makeDbRow({ id: 'u1', email: 'u1@example.com' });
    const other = makeDbRow({ id: 'u2', email: 'taken@example.com' });
    userRepository.getById = jest.fn().mockResolvedValue(existing);
    userRepository.getByEmail = jest.fn().mockResolvedValue(other);
    // Action / Assert
    await expect(userService.update('u1', { email: 'taken@example.com' })).rejects.toThrow('Email already in use');
  });

  it('deve deletar usuário existente', async () => {
    // Arrange
    const existing = makeDbRow({ id: 'del-1' });
    userRepository.getById = jest.fn().mockResolvedValue(existing);
    userRepository.delete = jest.fn().mockResolvedValue();
    // Action
    const res = await userService.delete('del-1');
    // Assert
    expect(userRepository.getById).toHaveBeenCalledWith('del-1');
    expect(userRepository.delete).toHaveBeenCalledWith('del-1');
    expect(res).toBeUndefined();
  });

  it('não deve deletar usuário inexistente', async () => {
    // Arrange
    userRepository.getById = jest.fn().mockResolvedValue(undefined);
    // Action & Assert
    await expect(userService.delete('nope')).rejects.toThrow('User not found');
  });
});
