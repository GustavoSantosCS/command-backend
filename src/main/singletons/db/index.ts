import {
  AccountTypeOrmRepository,
  EstablishmentTypeOrmRepository,
  MusicTypeOrmRepository,
  PlaylistTypeOrmRepository,
  ProductTypeOrmRepository,
  RequestProductTypeOrmRepository,
  SurveyTypeOrmRepository,
  UserTypeOrmRepository,
  VoteTypeOrmRepository
} from '@/infra/db/typeorm';

const accountRepo = new AccountTypeOrmRepository();
const establishmentRepo = new EstablishmentTypeOrmRepository();
const musicRepo = new MusicTypeOrmRepository();
const playlistRepo = new PlaylistTypeOrmRepository();
const productRepo = new ProductTypeOrmRepository();
const requestProductRepo = new RequestProductTypeOrmRepository();
const surveyRepo = new SurveyTypeOrmRepository();
const userRepo = new UserTypeOrmRepository();
const voteRepo = new VoteTypeOrmRepository();

export {
  accountRepo,
  establishmentRepo,
  musicRepo,
  playlistRepo,
  productRepo,
  requestProductRepo,
  surveyRepo,
  userRepo,
  voteRepo
};
