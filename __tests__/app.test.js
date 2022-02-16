const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("returns an array of all topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics).toHaveLength(3);
          response.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
    test('returns a 404 error when incorrect path passed, with a messagee that states "path not found"', () => {
      return request(app)
        .get("/api/topicos")
        .expect(404)
        .then((response) => {
          expect(response.body.message).toEqual("path not found");
        });
    });
  });
});
