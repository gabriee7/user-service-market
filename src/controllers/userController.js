import userService from '#services/userService.js';
import { StatusCodes } from 'http-status-codes';

const userController = {
  async create(req, res) {
    const { name, email, password } = req.body;
    const result = await userService.create({ name, email, password });
    return res.status(StatusCodes.CREATED).json(result);
  },

  async get(req, res) {
    const { id } = req.params;
    const result = await userService.get(id);
    return res.status(StatusCodes.OK).json(result);
  },

  async getAll(req, res) {
    const result = await userService.getAll();
    return res.status(StatusCodes.OK).json(result);
  },

  async getMe(req, res) {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not authenticated' });
    const result = await userService.get(userId);
    return res.status(StatusCodes.OK).json(result);
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;
    const userId = req.user && req.user.id;
    if (!userId || userId !== id)
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not allowed to modify this user' });
    const result = await userService.update(id, { name, email });
    return res.status(StatusCodes.OK).json(result);
  },

  async updateMe(req, res) {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not authenticated' });
    const { name, email } = req.body;
    const result = await userService.update(userId, { name, email });
    return res.status(StatusCodes.OK).json(result);
  },

  async changePassword(req, res) {
    const { id } = req.params;
    const userId = req.user && req.user.id;
    if (!userId || userId !== id)
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not allowed to change password for this user' });
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(id, { currentPassword, newPassword });
    return res.status(StatusCodes.NO_CONTENT).send();
  },

  async changePasswordMe(req, res) {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not authenticated' });
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(userId, { currentPassword, newPassword });
    return res.status(StatusCodes.NO_CONTENT).send();
  },

  async delete(req, res) {
    const { id } = req.params;
    const userId = req.user && req.user.id;
    if (!userId || userId !== id)
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not allowed to delete this user' });
    await userService.delete(id);
    return res.status(StatusCodes.NO_CONTENT).send();
  }
};

export default userController;