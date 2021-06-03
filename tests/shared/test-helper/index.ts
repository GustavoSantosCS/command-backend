import { AppError } from '@/shared/app-error';

export const throwsError = () => {
  throw new AppError('any_message');
};
