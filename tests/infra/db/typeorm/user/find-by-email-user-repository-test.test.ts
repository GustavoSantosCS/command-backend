import { UserEntity } from '@/data/entities';
import {
  AddUserRepository,
  SearchUserByEmailRepository
} from '@/data/protocols';
import { TypeORMHelpers, UserTypeOrmRepository } from '@/infra/db/typeorm';
import { makeMockUserEntity } from '@tests/data/mock/entities';

let addRepository: AddUserRepository;
let sut: SearchUserByEmailRepository;

describe('Test Integration', () => {
  beforeAll(async () => {
    await TypeORMHelpers.connect();
  });

  afterAll(async () => {
    await TypeORMHelpers.clearDataBase();
    await TypeORMHelpers.disconnect();
  });

  beforeEach(async () => {
    await TypeORMHelpers.clearDataBase();
    sut = new UserTypeOrmRepository();
    addRepository = sut as UserTypeOrmRepository;
  });

  it('should return an entity is add successfully', async () => {
    let entityToSave = makeMockUserEntity();
    entityToSave = (await addRepository.save(entityToSave)).value as UserEntity;

    const foundEntity = await sut.searchByEmail(entityToSave.email);

    expect(foundEntity.isRight()).toBeTruthy();
    expect(foundEntity.value as UserEntity).toEqual(entityToSave);
  });
});
