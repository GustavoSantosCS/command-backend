import { HttpResponse } from '@/presentation/protocols';
import { AppError } from '@/shared/app-error';

export const badRequest = (errors: AppError[]): HttpResponse => ({
  statusCode: 400,
  body: {
    errors: errors.map(error => ({
      message: error.message,
      value: error?.value
    }))
  }
});

export const serverError = (errors: AppError[]): HttpResponse => ({
  statusCode: 500,
  body: {
    errors: errors.map(error => ({
      message: error.message,
      value: error?.value
    }))
  }
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});
