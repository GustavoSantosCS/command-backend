/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { SurveyEntity } from '@/data/entities';
import {
  AddSurveyRepository,
  CloseSurveyRepository,
  GetAllEstablishmentSurveyRepository,
  GetSurveyByIdRepository
} from '@/data/protocols';
import { TypeORMHelpers } from './typeorm-helper';

export class SurveyTypeOrmRepository
  implements
    AddSurveyRepository,
    GetAllEstablishmentSurveyRepository,
    GetSurveyByIdRepository,
    CloseSurveyRepository
{
  async addSurvey(survey: SurveyEntity): Promise<SurveyEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(survey);
      await Promise.all(
        survey.surveyToMusic.map(sm => queryRunner.manager.save(sm))
      );
      await queryRunner.commitTransaction();

      survey.surveyToMusic = survey.surveyToMusic.map(sm => {
        delete sm.survey;
        delete sm.music.establishment;
        return sm;
      });

      delete survey.establishment.manager;
      delete survey.establishment.image;
      return survey;
    } catch (err) {
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

  async getById(
    surveyId: string,
    strategy?: GetSurveyByIdRepository.Strategy,
    includeClose?: boolean
  ): Promise<SurveyEntity> {
    const surveyRepo = await TypeORMHelpers.getRepository(SurveyEntity);
    if (!strategy) {
      return surveyRepo.findOne(surveyId, {
        withDeleted: includeClose
      });
    }

    let queryBuilder = surveyRepo.createQueryBuilder('surveys');
    if (
      strategy.includeEstablishment ||
      strategy.includeEstablishmentAndManager
    ) {
      queryBuilder = queryBuilder.innerJoinAndSelect(
        'surveys.establishment',
        'establishments'
      );

      if (strategy.includeEstablishmentAndManager) {
        queryBuilder = queryBuilder.innerJoinAndSelect(
          'establishments.manager',
          'users'
        );
      }
    }

    if (strategy.includeSurveyToMusic) {
      queryBuilder = queryBuilder
        .innerJoinAndSelect('surveys.surveyToMusic', 'survey_music')
        .innerJoinAndSelect('survey_music.music', 'musics');
    }

    queryBuilder = queryBuilder.where('surveys.id = :surveyId', { surveyId });

    if (includeClose) {
      queryBuilder = queryBuilder.withDeleted();
    }

    const survey = await queryBuilder.getOne();

    if (!survey) return null;

    if (strategy.includeMusics) {
      let musicQueryBuilder = surveyRepo
        .createQueryBuilder('surveys')
        .innerJoinAndSelect('surveys.musics', 'musics')
        .where('surveys.id = :surveyId', { surveyId });

      if (includeClose) musicQueryBuilder = musicQueryBuilder.withDeleted();
      const surveyAndMusics = await musicQueryBuilder.getOne();

      Object.assign(survey, { musics: surveyAndMusics.musics || [] });
    }

    if (strategy.includeVotes) {
      const votesQueryBuilder = surveyRepo
        .createQueryBuilder('surveys')
        .leftJoinAndSelect('surveys.pollVotes', 'votes')
        .innerJoinAndSelect('votes.client', 'users')
        .where('surveys.id = :surveyId', { surveyId });

      const surveyAndVotes = await votesQueryBuilder.getOne();
      Object.assign(survey, { pollVotes: surveyAndVotes?.pollVotes || [] });
      survey.pollVotes = survey?.pollVotes.map(s => {
        delete s.client.password;
        return s;
      });
    }

    return survey;
  }

  async remove(
    survey: SurveyEntity,
    softDelete: boolean
  ): Promise<SurveyEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      if (softDelete) {
        await queryRunner.manager.softRemove(survey);
      } else {
        const { surveyToMusic } = await this.getById(survey.id, {
          includeSurveyToMusic: true
        });

        await Promise.all(
          surveyToMusic.map(stm => queryRunner.manager.remove(stm))
        );
        await queryRunner.manager.remove(survey);
      }
      await queryRunner.commitTransaction();
      return survey;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
