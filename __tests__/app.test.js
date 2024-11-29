const request = require("supertest");
const endpointsJson = require("../endpoints.json");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(Object.keys(endpoints).length).toBeGreaterThan(0);
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("Non-existent endpoints", () => {
  test("404: Responds with an error for a non-existent endpoint", () => {
    return request(app)
      .get("/api/nonexistent")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});

describe("GET/api/articles/:article_id", () => {
  test("200: Responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: Responds with an error for a non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("400: Responds with an error for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("200: Responds with articles sorted by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Responds with articles sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: false });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comment objects", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });

  test("200: Responds with an empty array for an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test("200: Responds with comments sorted by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Responds with comments sorted by votes in ascending order", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=votes&order=ASC")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("votes", { descending: false });
      });
  });

  test("404: Responds with an error for a non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });

  test("400: Responds with an error for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "This is a test comment." })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "This is a test comment.",
          article_id: 1,
        });
      });
  });
  test("400: Responsds with an error when an article id is invlaid", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send({ username: "butter_bridge", body: "This is a test comment." })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("400: Responds with an error for missing username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "This is a test comment." })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid username or body");
      });
  });
  test("400: Responds with an error for missing body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid username or body");
      });
  });
  test("404: Responds with an error for a non-existent article_id", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({ username: "butter_bridge", body: "This is a test comment." })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic or article or user not found");
      });
  });
  test("404: Responds with an error for a non-existent username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "non_existent_user", body: "This is a test comment." })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic or article or user not found");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article when inc_vote is positive", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          body: expect.any(String),
          votes: 1,
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: Responds with the updated article when inc_vote is negative", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          body: expect.any(String),
          votes: 0,
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Responds with an error for an invalid inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "banana" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid vote input");
      });
  });
  test("Respond with an error when no inc_votes input", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid vote input");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: Responds with an error for a non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment not found");
      });
  });
  test("400: Responds with an error for an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});
