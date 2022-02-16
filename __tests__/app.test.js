const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("404 Error - path not found", () => {
  test('returns a 404 error when incorrect path passed, with a messagee that states "path not found"', () => {
    return request(app)
      .get("/api/topicos")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("path not found");
      });
  });
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
  });
});
describe("api/articles/:article_id", () => {
  describe("GET", () => {
    test("responds with a single matching article", () => {
      const articleId = 3;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: articleId,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });
    test("status 400: bad request. Responds with an error message when passed a wrong user ID", () => {
      return request(app)
        .get("/api/articles/notanID")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Bad Request");
        });
    });
    test("status 404: path not found. Responds with an error message when passed an article id that does not exist ", () => {
      const articleId = 999999;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(404)
        .then(({ body }) => {
          console.log(body.message, "body message");
          expect(body.message).toEqual("ID does not exist");
        });
    });
  });
});
