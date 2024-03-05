import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbdatasource } from '../../data.source';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees  -  /coffees', () => {
  let app: INestApplication;
  const coffee = {
    title: 'Shipward Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  let id;
  const expectedCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => {
        return expect.objectContaining({ name });
      }),
    ),
  });
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          ...{ ...dbdatasource, port: 5433 },
          autoLoadEntities: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        id = body.id;
        expect(body).toEqual(expectedCoffee);
      });
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        console.log('body', body);
        expect(body).toEqual(expect.arrayContaining([expectedCoffee]));
      });
  });
  it('Get id [GET /:id]', () => {
    return request(app.getHttpServer())
      .get(`/coffees/${id}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual(expectedCoffee);
      });
  });
  it('Update one [PATCH /:id]', () => {
    const updateObj: UpdateCoffeeDto = {
      brand: 'nescafe',
      flavors: ['caramel'],
    };
    return request(app.getHttpServer())
      .patch(`/coffees/${id}`)
      .send(updateObj)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            ...updateObj,
            ...(updateObj?.flavors && {
              flavors: expect.arrayContaining(
                updateObj.flavors.map((name) => {
                  return expect.objectContaining({ name });
                }),
              ),
            }),
          }),
        );
      });
  });
  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete(`/coffees/${id}`)
      .expect(HttpStatus.OK)
      // .then(({ body }) => {
      // });
  });
  afterAll(async () => {
    await app.close();
  });
});
