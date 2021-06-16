import { UserEntity } from '@/data/entities';
import { AddUserRepository } from '@/data/protocols';
import { TypeORMHelpers, UserTypeOrmRepository } from '@/infra/db/typeorm';
import { makeMockUserEntity } from '@tests/data/mock/entities';

let sut: AddUserRepository;
let userEntity: UserEntity;
describe('Test Integration', () => {
  beforeAll(async () => {
    await TypeORMHelpers.connect();
  });

  afterAll(async () => {
    await TypeORMHelpers.clearDataBase();
    await TypeORMHelpers.disconnect();
  });

  beforeEach(async () => {
    userEntity = makeMockUserEntity();
    delete userEntity.avatar;

    await TypeORMHelpers.clearDataBase();
    sut = new UserTypeOrmRepository();
  });

  it('should return an entity is add successfully', async () => {
    const result = await sut.save(userEntity);

    const value: UserEntity = result.value as UserEntity;
    expect(result.isRight()).toBeTruthy();
    expect(value.id).toBe(userEntity.id);
    expect(value.name).toBe(userEntity.name);
    expect(value.email).toBe(userEntity.email);
    expect(value.password).toBe(userEntity.password);
  });
});
