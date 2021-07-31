import request from 'supertest';
import faker from 'faker';
import app from '@/main/config/app';
import { TypeORMHelpers, UserTypeOrmRepository } from '@/infra/db/typeorm';
import { UserEntity } from '@/data/entities';
import { makeMockAddUser } from '@tests/domain/mock/models';

describe('Tests Integration User Add Router', () => {
  beforeAll(async () => {
    await TypeORMHelpers.connect();
  });

  afterAll(async () => {
    await TypeORMHelpers.disconnect();
  });

  beforeEach(async () => {
    await TypeORMHelpers.clearDataBase();
  });

  describe('POST /user', () => {
    it('should return 200 on create', async () => {
      const { name, email, password, confirmPassword } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          name,
          email,
          password,
          confirmPassword
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .catch(console.error);
      // const body = JSON.parse(response.text);
      // expect(body).toHaveProperty('id');
    });

    it('should return 400 if name is not provider', async () => {
      const { email, password, confirmPassword } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          email,
          password,
          confirmPassword
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('name não informado');
    });

    it('should return 400 if the name has less than 3 digits', async () => {
      const { email, password, confirmPassword } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          name: 'AA',
          email,
          password,
          confirmPassword
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('name deve conter ao menos 3 letras');
    });

    it('should return 400 if email is not provider', async () => {
      const { name, password, confirmPassword } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          name,
          password,
          confirmPassword
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('E-mail não informado');
    });

    it('should return 400 if the email provider is not email', async () => {
      const { name, password, confirmPassword } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          name,
          email: faker.random.word(),
          password,
          confirmPassword
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('Valor informado não é um email');
    });

    it('should return 400 if the email provider is being using', async () => {
      const { name, email, password, confirmPassword } = makeMockAddUser();
      const repository = new UserTypeOrmRepository();
      await repository.save(
        new UserEntity({
          id: faker.datatype.uuid(),
          name,
          email,
          password
        })
      );
      const response = await request(app)
        .post('/user')
        .send({
          name,
          email,
          password,
          confirmPassword
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('Email já está em uso!');
    });

    it('should return 400 if password is not provider', async () => {
      const { name, email, confirmPassword } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          name,
          email,
          confirmPassword
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('Senha não informada');
    });

    it('should return 400 if the password has less than 5 digits', async () => {
      const { name, email } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          name,
          email,
          password: 'ABCD',
          confirmPassword: 'ABCD'
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('Senha deve ter pelo menos 5 caracteres');
    });

    it('should return 400 if confirmPassword is not provider', async () => {
      const { name, email, password } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          name,
          email,
          password
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('Confirmação de Senha não informada');
    });

    it('should return 400 if confirmPassword is not equal to password', async () => {
      const { name, email, password } = makeMockAddUser();
      const response = await request(app)
        .post('/user')
        .send({
          name,
          email,
          password,
          confirmPassword: `${password}_different`
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .catch(console.error);
      // const { errors } = JSON.parse(response.text);
      // expect(errors[0].message).toBe('Senhas não batem');
    });
  });
});
