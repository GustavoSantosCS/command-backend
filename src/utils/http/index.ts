import { HttpResponse } from '@/presentation/protocols';
import { AppError } from '@/shared/app-error';

export const badRequest = (errors: AppError[] | AppError): HttpResponse => {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(errors)) errors = [errors];
  return {
    statusCode: 400,
    body: {
      errors: errors.map(error => ({
        message: error.message,
        value: error?.value
      }))
    }
  };
};

export const serverError = (errors: AppError[] | AppError): HttpResponse => {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(errors)) errors = [errors];
  return {
    statusCode: 500,
    body: {
      errors: errors.map(error => ({
        message: error.message,
        value: error?.value
      }))
    }
  };
};

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});

export const notAuthorizedErro = (): HttpResponse => ({
  statusCode: 401,
  body: {
    errors: [
      {
        message: 'Not Authorized'
      }
    ]
  }
});
