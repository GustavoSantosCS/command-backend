import { AddAccountUseCase } from '@/domain/usecases/account';
import { AddAccountController } from '@/presentation/controllers/accounts';
import { HttpRequest } from '@/presentation/protocols';
import { Validator } from '@/validator/protocols';
import { makeMockAddAccountUseCase } from '@tests/domain/usecases';
import { makeMockValidator } from '@tests/validator/mock';
import { makeMockHttpRequest } from '@tests/presentation/controllers/accounts/add/mock';

let sut: AddAccountController;
let httpRequestMock: HttpRequest;
let validatorMock: Validator;
let addAccountUseCaseMock: AddAccountUseCase;

describe('Test Unit: AddAccountController', () => {
  beforeEach(() => {
    httpRequestMock = makeMockHttpRequest();
    validatorMock = makeMockValidator();
    addAccountUseCaseMock = makeMockAddAccountUseCase();
    sut = new AddAccountController(validatorMock, addAccountUseCaseMock);
  });

  it('should call the validator with the correct values', async () => {
    const spy = jest.spyOn(validatorMock, 'validate');
    await sut.handle(httpRequestMock);

    expect(spy).toBeCalledWith(httpRequestMock.body);
  });
});
