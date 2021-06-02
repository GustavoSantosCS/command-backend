export class InternalServerError extends Error {
  constructor() {
    super('Erro No Servidor');
    this.name = 'InternalServerError';
  }
}
