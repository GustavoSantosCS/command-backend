/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import {
  EstablishmentEntity,
  MusicEntity,
  SurveyEntity,
  SurveyMusicEntity
} from '@/data/entities';
import {
  AddSurveyRepository,
  GetAllEstablishmentSurveyRepository
} from '@/data/protocols';
import { SurveyModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class SurveyTypeOrmRepository
  implements AddSurveyRepository, GetAllEstablishmentSurveyRepository
{
  async addSurvey(survey: SurveyModel): Promise<SurveyEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      let surveyEntity = new SurveyEntity();
      surveyEntity.id = survey.id;
      surveyEntity.question = survey.question;
      surveyEntity.establishment = survey.establishment as EstablishmentEntity;
      surveyEntity = await queryRunner.manager.save(surveyEntity);
      surveyEntity.musics = [];
      for await (const choice of survey.choices) {
        let surveyMusicEntity = new SurveyMusicEntity();
        surveyMusicEntity.id = choice.id;
        surveyMusicEntity.music = choice.music as MusicEntity;
        surveyMusicEntity.survey = surveyEntity;
        surveyMusicEntity.position = choice.position;
        surveyMusicEntity = await queryRunner.manager.save(surveyMusicEntity);
        surveyEntity.musics.push(surveyMusicEntity.music);
      }
      await queryRunner.commitTransaction();

      delete surveyEntity.establishment;
      return surveyEntity;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('SurveyTypeOrmRepository:49 => ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllEstablishmentSurvey(
    establishmentId: string
  ): Promise<SurveyEntity[]> {
    try {
      const repository = await TypeORMHelpers.getRepository(SurveyEntity);

      const surveys = await repository
        .createQueryBuilder('survey')
        .leftJoin(
          'survey.establishment',
          'establishments',
          'establishments.id = :establishmentId',
          { establishmentId }
        )
        .innerJoinAndSelect('survey.surveyToMusic', 'survey_music')
        .innerJoinAndSelect('survey_music.music', 'musics')
        .orderBy('survey.createdAt', 'ASC')
        .getMany();

      return surveys;
    } catch (error) {
      console.error(error);

      return [];
    }
  }
}
