import { UserEntity } from '@/data/entities';
import { AddUserRepository } from '@/data/protocols';
import { TypeORMHelpers, UserTypeOrmRepository } from '@/infra/db/typeorm';
import { makeMockUserEntity } from '@tests/data/mock/entities';

let sut: AddUserRepository;

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
  });

  it('should return an entity is add successfully', async () => {
    const entityToSave = makeMockUserEntity();
    const result = await sut.save(entityToSave);

    expect(result.isRight()).toBeTruthy();
    expect((result.value as UserEntity).id).toBe(entityToSave.id);
    expect((result.value as UserEntity).nome).toBe(entityToSave.nome);
    expect((result.value as UserEntity).email).toBe(entityToSave.email);
    expect((result.value as UserEntity).password).toBe(entityToSave.password);
  });
});
