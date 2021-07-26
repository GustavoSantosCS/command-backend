import { EstablishmentModel } from './establishment-model';
import { MusicModel } from './music-model';

export type SurveyModel = {
  id: string;
  question: string;
  establishment: EstablishmentModel;
  choices: ChoiceModel[];
  createdAt?: Date;
  updatedAt?: Date;
  closedAt?: Date;
};

export type ChoiceModel = {
  id: string;
  music: MusicModel;
  votes: number;
  position: number;
};
