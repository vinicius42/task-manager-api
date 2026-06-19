import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

// describe('AppController (e2e)', () => {
//   let app: INestApplication<App>;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });

//   afterEach(async () => {
//     await app.close();
//   });
// });

describe('CreateUserController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true
    }));

    await app.init();

    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM task_entity');
    await dataSource.query('DELETE FROM user_entity');

    const user = {
      email: 'teste@email.com',
      password: 'password',
      role: 'admin'
    }

    await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
  })

  it('should login with valid credentials', async () => {
    const credentials = {
      email: 'teste@email.com',
      password: 'password'
    }

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(200)
      .then((response) => {
        expect(response.body.access_token).toBeDefined();
      })
  })

  it('should not login with invalid password', async () => {
    const credentials = {
      email: 'teste@email.com',
      password: 'wrongpassword'
    }

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(401)
      .then((response) => {
        expect(response.body.message).toContain('Invalid password');
      })
  })

  it('should not login with non-existing email', async () => {
    const credentials = {
      email: 'nonexisting@email.com',
      password: 'password'
    }

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toContain('User not found');
      })
  })

  it('should validate race condition on user creation and return conflict - email already exists', async () => {
    const user = {
      email: 'email@email.com',
      password: 'password',
      role: 'admin'
    }

    const user2 = {
      email: 'email@email.com',
      password: 'password',
      role: 'admin'
    }

    const [ response1, response2 ] = await Promise.all([
      request(app.getHttpServer()).post('/users').send(user),
      request(app.getHttpServer()).post('/users').send(user2) 
    ])

    const statuses = [response1.status, response2.status].sort();

    expect(statuses).toEqual([201, 409])
  })
 
  it('should create a new user', async () => {
    const user = {
      email: 'emailfsa@email.com',
      password: 'password',
      role: 'admin'
    }

    return await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
      .then((response) => {
        expect(response.body.id).toBeDefined();
        expect(response.body.email).toBe(user.email);
        expect(response.body.role).toBe(user.role);
        expect(response.body.createdAt).toBeDefined();
      })
  })

  it('should not create a new user with invalid email', async () => {
    const user = {
      email: 'invalid-email',
      password: 'password',
      role: 'admin'
    }

    return await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('email must be an email');
      })
  })

  it('should not create a new user with missing password', async () => {
    const user = {
      email: 'teste@email.com',
      role: 'admin'
    }

    return await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('Password cannot be empty');
        expect(response.body.message).toContain('password must be a string');
    })
  })

  afterAll(async () => {
    await app.close();
  })
  
})