import { AppError } from '@/shared/errors';

export class PlaylistNotFoundError extends AppError {
  constructor() {
    super('Playlist não encontrada');
    this.name = 'PlaylistNotFoundError';
  }
}
