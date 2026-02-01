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

  async update(req, res) {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const result = await userService.update(id, { name, email, password });
    return res.status(StatusCodes.OK).json(result);
  },

  async delete(req, res) {
    const { id } = req.params;
    await userService.delete(id);
    return res.status(StatusCodes.NO_CONTENT).send();
  }
};

export default userController;