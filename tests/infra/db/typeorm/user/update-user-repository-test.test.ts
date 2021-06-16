import { UserEntity } from '@/data/entities';
import { UpdateUserRepository } from '@/data/protocols';
import { UserModel } from '@/domain/models';
import { TypeORMHelpers, UserTypeOrmRepository } from '@/infra/db/typeorm';
import { makeMockUserModel } from '@tests/domain/mock/models';

let sut: UpdateUserRepository;
let newUserDateModel: UserModel;
let currentUserDateModel: UserModel;

describe('Test Integration: UpdateUserRepository', () => {
  beforeAll(async () => {
    await TypeORMHelpers.connect();
    sut = new UserTypeOrmRepository();
  });

  afterAll(async () => {
    await TypeORMHelpers.clearDataBase();
    await TypeORMHelpers.disconnect();
  });

  beforeEach(async () => {
    currentUserDateModel = makeMockUserModel({ id: true, avatar: false });
    newUserDateModel = makeMockUserModel({ id: false, avatar: false });
    newUserDateModel.id = currentUserDateModel.id;

    await new UserTypeOrmRepository().save(currentUserDateModel);
  });

  it('should return an entity is update success', async () => {
    const result = await sut.update(newUserDateModel);

    const value: UserEntity = result.value as UserEntity;
    expect(result.isRight()).toBeTruthy();
    expect(value.id).toBe(newUserDateModel.id);
    expect(value.name).toBe(newUserDateModel.name);
    expect(value.email).toBe(newUserDateModel.email);
    expect(value.password).toBe(newUserDateModel.password);
  });
});
