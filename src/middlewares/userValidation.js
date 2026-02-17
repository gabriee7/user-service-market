import Joi from 'joi';
import { BadRequestException } from '#errors/index.js';

const createSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const updateSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  email: Joi.string().email().optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required()
});

export function validateUserCreate(req, res, next) {
  const { error } = createSchema.validate(req.body);
  if (error) throw new BadRequestException(error.details[0].message);
  next();
}

export function validateUserUpdate(req, res, next) {
  const { error } = updateSchema.validate(req.body);
  if (error) throw new BadRequestException(error.details[0].message);
  next();
}

export function validateChangePassword(req, res, next) {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) throw new BadRequestException(error.details[0].message);
  next();
}

export { validateUserCreate as validateUser };