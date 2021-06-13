import { PersistencyError } from '@/infra/errors';

export const persistencyError = new PersistencyError(
  'any_message',
  {},
  'any_value'
);
