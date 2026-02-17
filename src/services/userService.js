import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import userRepository from '#repositories/userRepository.js';
import UserMapper from '#dtos/UserMapper.js';
import { ConflictException, NotFoundException } from '#errors/index.js';

const SALT_ROUNDS = 10;

const userService = {
  async create({ name, email, password }) {
    const existing = await userRepository.getByEmail(email);
    if (existing)
      throw new ConflictException('Email already in use');
    const id = uuidv4();
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const created = await userRepository.create({ id, name, email, password: hashed });
    return UserMapper.toResponse(created);
  },

  async get(id) {
    const found = await userRepository.getById(id);
    if (!found)
      throw new NotFoundException('User not found');
    return UserMapper.toResponse(found);
  },

  async getAll() {
    const rows = await userRepository.getAll();
    return rows.map((r) => UserMapper.toResponse(r));
  },

  async update(id, { name, email, password }) {
    const user = await userRepository.getById(id);
    if (!user)
      throw new NotFoundException('User not found');
    if (email && email !== user.email) {
      const byEmail = await userRepository.getByEmail(email);
      if (byEmail && byEmail.id !== id)
        throw new ConflictException('Email already in use');
    }
    const updated = await userRepository.update(
      id,
      { 
        name: name || user.name,
        email: email || user.email,
        password: user.password
      }
    );
    return UserMapper.toResponse(updated);
  },

  async changePassword(id, { currentPassword, newPassword }) {
    const user = await userRepository.getById(id);
    if (!user) throw new NotFoundException('User not found');
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new ConflictException('Current password is incorrect');
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const updated = await userRepository.update(id, { name: user.name, email: user.email, password: hashed });
    return UserMapper.toResponse(updated);
  },

  async delete(id) {
    const user = await userRepository.getById(id);
    if (!user)
      throw new NotFoundException('User not found');
    await userRepository.delete(id);
    return;
  }
};

export default userService;