
import Joi from 'joi';

const errorMessage = {
  'any.required': '{#label} is a required field',
};

export const ListSchema = Joi.object({
  page: Joi.number()
    .label('Page')
    .messages({ ...errorMessage }),
  limit: Joi.number()
    .label('Limit')
    .messages({ ...errorMessage }),
}).options({
  abortEarly: false,
});