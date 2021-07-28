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
  CloseSurveyRepository,
  GetAllEstablishmentSurveyRepository,
  GetSurveyByIdRepository
} from '@/data/protocols';
import { SurveyModel } from '@/domain/models';
import { QueryBuilder } from 'typeorm';
import { TypeORMHelpers } from './typeorm-helper';

export class SurveyTypeOrmRepository
  implements
    AddSurveyRepository,
    GetAllEstablishmentSurveyRepository,
    GetSurveyByIdRepository,
    CloseSurveyRepository
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
    strategy?: GetSurveyByIdRepository.Strategy
  ): Promise<SurveyEntity> {
    const surveyRepo = await TypeORMHelpers.getRepository(SurveyEntity);
    if (!strategy) {
      return surveyRepo.findOne(surveyId);
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

    if (strategy.includeVotes) {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        'surveys.pollVotes',
        'votes'
      );
    }

    if (strategy.includeMusics) {
      queryBuilder = queryBuilder.leftJoinAndSelect('surveys.musics', 'musics');
    }

    if (strategy.includeSurveyToMusic) {
      queryBuilder = queryBuilder.innerJoinAndSelect(
        'surveys.surveyToMusic',
        'survey_music'
      );
    }

    return queryBuilder.where('surveys.id = :surveyId', { surveyId }).getOne();
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
