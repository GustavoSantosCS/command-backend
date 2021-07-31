import { UserEntity } from '@/data/entities';
import { UpdateUserRepository } from '@/data/protocols';
import { TypeORMHelpers, UserTypeOrmRepository } from '@/infra/db/typeorm';
import { makeMockUser } from '@tests/domain/mock/models';

let sut: UpdateUserRepository;
let newUserDateModel: UserEntity;
let currentUserDateModel: UserEntity;

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
    currentUserDateModel = makeMockUser({ id: true, avatar: false });
    newUserDateModel = makeMockUser({ id: false, avatar: false });
    newUserDateModel.id = currentUserDateModel.id;

    await new UserTypeOrmRepository().save(currentUserDateModel);
  });

  it('should return an entity is update success', async () => {
    const result = await sut.update(newUserDateModel);

    expect(result.id).toBe(newUserDateModel.id);
    expect(result.name).toBe(newUserDateModel.name);
    expect(result.email).toBe(newUserDateModel.email);
    expect(result.password).toBe(newUserDateModel.password);
  });
});
