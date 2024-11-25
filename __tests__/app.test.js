const request = require("supertest");
const endpointsJson = require("../endpoints.json");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeAll(() => {
  return seed(data);
});

afterAll(() => {});

describe("GET/api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET/api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("404: Responds with an error for a non-existent endpoint", () => {
    return request(app)
      .get("/api/nonexistent")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("Not Found");
      });
  });
});
