import { SurveyEntity, SurveyMusicEntity, VoteEntity } from '@/data/entities'
import {
  AddSurveyRepository,
  CloseSurveyRepository,
  GetAllEstablishmentSurveyRepository,
  GetSurveyByIdRepository
} from '@/data/protocols'
import { TypeORMHelpers } from './typeorm-helper'

export class SurveyTypeOrmRepository
  implements
    AddSurveyRepository,
    GetAllEstablishmentSurveyRepository,
    GetSurveyByIdRepository,
    CloseSurveyRepository
{
  async save(survey: SurveyEntity): Promise<SurveyEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.save(survey)
      await Promise.all(
        survey.surveyToMusic.map(async (sm: SurveyMusicEntity) =>
          queryRunner.manager.save(sm)
        )
      )
      await queryRunner.commitTransaction()

      survey.surveyToMusic = survey.surveyToMusic.map(
        (sm: SurveyMusicEntity) => {
          delete sm.survey
          delete sm.music.establishment
          return sm
        }
      )

      delete survey.establishment.manager
      delete survey.establishment.image
      return survey
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async getAllEstablishmentSurvey(
    establishmentId: string
  ): Promise<SurveyEntity[]> {
    try {
      const repository = await TypeORMHelpers.getRepository(SurveyEntity)

      const surveys = await repository
        .createQueryBuilder('survey')
        .addSelect('survey.updatedAt')
        .addSelect('survey.closedAt')
        .innerJoin(
          'survey.establishment',
          'establishments',
          'establishments.id = :establishmentId',
          { establishmentId }
        )
        .innerJoinAndSelect('survey.surveyToMusic', 'survey_music')
        .leftJoinAndSelect('survey.pollVotes', 'votes')
        .innerJoinAndSelect('survey_music.music', 'musics')
        .innerJoinAndSelect('musics.image', 'music_image')
        .withDeleted()
        .orderBy('survey.createdAt', 'ASC')
        .getMany()

      const surveyWithVote = []
      for await (const survey of surveys) {
        let result = await repository
          .createQueryBuilder('surveys')
          .leftJoinAndSelect('surveys.pollVotes', 'votes')
          .innerJoinAndSelect('votes.chosenMusic', 'musics')
          .innerJoinAndSelect('votes.client', 'users')
          .innerJoinAndSelect('musics.image', 'music_image')
          .where('surveys.id = :id', { id: survey.id })
          .withDeleted()
          .getOne()

        result = Object.assign(survey, result)

        surveyWithVote.push(result)
      }
      return surveyWithVote
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async getById(
    surveyId: string,
    strategy?: GetSurveyByIdRepository.Strategy,
    withClose?: boolean
  ): Promise<SurveyEntity> {
    const surveyRepo = await TypeORMHelpers.getRepository(SurveyEntity)
    if (!strategy) {
      return surveyRepo.findOne(surveyId, {
        withDeleted: withClose
      })
    }

    let queryBuilder = surveyRepo.createQueryBuilder('surveys')
    if (strategy.withEstablishment || strategy.withEstablishmentAndManager) {
      queryBuilder = queryBuilder.innerJoinAndSelect(
        'surveys.establishment',
        'establishments'
      )

      if (strategy.withEstablishmentAndManager) {
        queryBuilder = queryBuilder.innerJoinAndSelect(
          'establishments.manager',
          'users'
        )
      }
    }

    if (strategy.withSurveyToMusic) {
      queryBuilder = queryBuilder
        .innerJoinAndSelect('surveys.surveyToMusic', 'survey_music')
        .innerJoinAndSelect('survey_music.music', 'musics')
    }

    queryBuilder = queryBuilder.where('surveys.id = :surveyId', { surveyId })

    if (withClose) {
      queryBuilder = queryBuilder.withDeleted()
    }

    if (strategy.withClosed) {
      queryBuilder = queryBuilder.addSelect('surveys.closedAt')
    }

    const survey = await queryBuilder.getOne()

    if (!survey) return null

    if (strategy.withMusics) {
      let musicQueryBuilder = surveyRepo
        .createQueryBuilder('surveys')
        .innerJoinAndSelect('surveys.musics', 'musics')
        .where('surveys.id = :surveyId', { surveyId })

      if (withClose) musicQueryBuilder = musicQueryBuilder.withDeleted()
      const surveyAndMusics = await musicQueryBuilder.getOne()

      Object.assign(survey, { musics: surveyAndMusics.musics || [] })
    }

    if (strategy.withVotes) {
      const votesQueryBuilder = surveyRepo
        .createQueryBuilder('surveys')
        .leftJoinAndSelect('surveys.pollVotes', 'votes')
        .innerJoinAndSelect('votes.client', 'users')
        .where('surveys.id = :surveyId', { surveyId })

      const surveyAndVotes = await votesQueryBuilder.getOne()
      Object.assign(survey, { pollVotes: surveyAndVotes?.pollVotes || [] })
      survey.pollVotes = survey?.pollVotes.map((vote: VoteEntity) => {
        delete vote.client.password
        return vote
      })
    }

    return survey
  }

  async remove(
    survey: SurveyEntity,
    softDelete: boolean
  ): Promise<SurveyEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner()

    await queryRunner.startTransaction()
    try {
      if (softDelete) {
        await queryRunner.manager.softRemove(survey)
      } else {
        const { surveyToMusic } = await this.getById(survey.id, {
          withSurveyToMusic: true
        })

        await Promise.all(
          surveyToMusic.map(async (stm: SurveyMusicEntity) =>
            queryRunner.manager.remove(stm)
          )
        )
        await queryRunner.manager.remove(survey)
      }
      await queryRunner.commitTransaction()
      return survey
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}
