const request = require('supertest');
const app = require('../../../app');
const newTodo = require('../../../model/__mock__/todo');
const mongodb = require('../../../mongodb/mongodb.connect');

const endpointUrl = '/todos/';
let firstTodo, newTodoId;
const testData = { title: 'Make integragion test for PUT', done: true };
const nonExistingTodoId = '5e0e3f729d09773b74d02a4a';

describe(endpointUrl, () => {
  beforeAll(() => {
    mongodb.connect();
  });

  afterAll(() => {
    mongodb.disconnect();
  });

  describe('GET', () => {
    it(`GET ${endpointUrl}`, async () => {
      const response = await request(app).get(endpointUrl);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].done).toBeDefined();
      firstTodo = response.body[0];
    });

    it(`GET ${endpointUrl}:todoId`, async () => {
      const response = await request(app).get(endpointUrl + firstTodo._id);

      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe(firstTodo.title);
      expect(response.body.done).toBe(firstTodo.done);
    });

    it(`GET todoId doesn't exists ${endpointUrl}:todoId`, async () => {
      const response = await request(app).get(endpointUrl + '5e0e3f729d09773b74d0293a');

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST', () => {
    it(`POST ${endpointUrl}`, async () => {
      const response = await request(app)
        .post(endpointUrl)
        .send(newTodo);

      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe(newTodo.title);
      expect(response.body.done).toBe(newTodo.done);
      newTodoId = response.body._id;
    });

    it('should return error 500 on malformed data with POST ' + endpointUrl,
      async () => {
        const response = await request(app)
          .post(endpointUrl)
          .send({ title: 'Missing done property' });

        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
          message: 'todo validation failed: done: Path `done` is required.',
        });
      });
  });

  describe('PUT', () => {
    it(`PUT ${endpointUrl}`, async () => {
      const res = await request(app)
        .put(endpointUrl + newTodoId)
        .send(testData);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(testData.title);
      expect(res.body.done).toBe(testData.done);
    });
  });

  describe('DELETE', () => {
    it(`DELETE ${endpointUrl}`, async () => {
      const response = await request(app).delete(endpointUrl + newTodoId).send();

      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe(testData.title);
      expect(response.body.done).toBe(testData.done);
    });

    it(`DELETE ${endpointUrl} 404`, async () => {
      const response = await request(app).delete(endpointUrl + nonExistingTodoId).send();

      expect(response.statusCode).toBe(404);
    });
  });
});
