const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("404 Error - path not found: topics, users and articles", () => {
  test('returns a 404 error when incorrect path passed, with a message that states "path not found"', () => {
    return request(app)
      .get("/api/noname")
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
          expect(body.article).toMatchObject({
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

          expect(body.message).toEqual("ID does not exist");

        });
    });
  });
});

describe("PATCH api/articles/:article_id", () => {
  test('Update article so the vote counts increases by "newVote" property (positive number)', () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(101);
      });
  });
  test('Update article so the vote counts decrease by "newVote" property (negative number)', () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(90);
      });
  });
  test("status 400: Bad request. Returns a 400 error when passed the wrong data type into inc_votes object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not a number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
});

describe("GET api/users", () => {
  test("should return an array of objects containing the username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toHaveLength(4);
        response.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),

            })
          );
        });
      });
  });
});

describe("GET api/articles", () => {
  test("should return an array of articles containing the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toHaveLength(12);
        response.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article:id (comment count)", () => {
  test("Article response object should now include the comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          comment_count: 11,
        });
      });
  });
});

