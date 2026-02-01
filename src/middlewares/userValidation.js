import Joi from 'joi';
import { BadRequestException } from '#errors/index.js';

const schema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export function validateUser(req, res, next) {
  const { error } = schema.validate(req.body);
  if (error)
    throw new BadRequestException(error.details[0].message);
  next();
}