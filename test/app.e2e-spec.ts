import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

let app: INestApplication;
let dataSource: DataSource;
let authTokenAdmin: string;
let authTokenRegular: string;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  dataSource = moduleFixture.get<DataSource>(DataSource);
});

describe('Auth Tests', () => {
  it('should register and login with a new admin user', async () => {
    //  1. Register a new admin user
    const registerAdminResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'testuser',
        email: 'testadmin@example.com',
        password: 'password123',
        roles: ['admin'],
      });

    expect(registerAdminResponse.status).toBe(201);

    // 2. Login with the new admin user
    const loginAdminResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testadmin@example.com',
        password: 'password123',
      });

    expect(loginAdminResponse.status).toBe(201);
    expect(loginAdminResponse.body).toHaveProperty('access_token');

    authTokenAdmin = loginAdminResponse.body.access_token;
  });

  it('should register and login with a new regular user', async () => {
    //  1. Register a new regular user
    const registerRegularUserResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'regular',
      });

    expect(registerRegularUserResponse.status).toBe(201);

    // 2. Login with the new regular user
    const loginRegularResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(loginRegularResponse.status).toBe(201);
    expect(loginRegularResponse.body).toHaveProperty('access_token');

    authTokenRegular = loginRegularResponse.body.access_token;
  });
});

afterAll(async () => {
  await dataSource.destroy();
  await app.close();
});

export { app, request, authTokenAdmin, authTokenRegular };
