import { HttpResponse } from '@/presentation/protocols'
import { AppError } from '@/shared/errors'

export const badRequest = (errors?: AppError[] | AppError): HttpResponse => {
  if (!Array.isArray(errors)) errors = [errors]
  return {
    statusCode: 400,
    body: {
      errors: errors.map((error: AppError) => ({
        message: error.message,
        ...error?.data
      }))
    }
  }
}

export const serverError = (errors?: AppError[] | AppError): HttpResponse => {
  if (!errors) {
    return {
      statusCode: 500,
      body: {
        errors: [
          {
            message: 'Error no Servidor'
          }
        ]
      }
    }
  }

  if (!Array.isArray(errors)) errors = [errors]
  return {
    statusCode: 500,
    body: {
      errors: errors.map((error: AppError) => ({
        message: error.message,
        ...error?.data
      }))
    }
  }
}

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const notAuthorizedErro = (): HttpResponse => ({
  statusCode: 401,
  body: {
    error: {
      message: 'Não Autorizado'
    }
  }
})
