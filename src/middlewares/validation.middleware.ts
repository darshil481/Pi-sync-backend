import { RequestHandler } from 'express';
import { cleanObj, generalResponse } from '../helpers/common.helper';

interface Error {
  message: string;
  path: Object;
  type: string;
  context: any;
}

const errorFilterValidator = (error: Array<Error>) => {
  const extractedErrors: Array<string> = [];
  error.map((err: Error) => extractedErrors.push(err.message));
  const errorResponse = extractedErrors.join(', ');
  return errorResponse;
};

const validationMiddleware = (type: any, value: string | 'body' | 'query' | 'params' = 'body'): RequestHandler => {
  return async (req:any, res, next) => {
    try {
      cleanObj(req[value]);
      await type.validateAsync(req[value]);
      next();
    } catch (e) {
      const error: any = e;
      if (error.details) {
        const errorResponse = errorFilterValidator(error.details);
        return generalResponse(res, null, errorResponse, 'error', true, 400);
      }
      return generalResponse(res, null, 'Something went wrong!', 'error', true, 400);
    }
  };
};

export default validationMiddleware;
