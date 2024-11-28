const express = require("express");
const {
  getAllNews,
  getAllTopics,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./app.controller");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errorHandlers");
const {
  validateCommentInput,
  validateSortAndOrder,
} = require("./validationMiddleware");

const app = express();

app.use(express.json());

const validArticleSorts = [
  "article_id",
  "title",
  "topic",
  "author",
  "created_at",
  "votes",
];
const validCommentSorts = ["comment_id", "votes", "created_at", "author"];
const validOrders = ["ASC", "DESC"];

app.get("/api", getAllNews);
app.get("/api/topics", getAllTopics);
app.get(
  "/api/articles",
  validateSortAndOrder(validArticleSorts, validOrders),
  getAllArticles
);
app.get("/api/articles/:article_id", getArticleById);
app.get(
  "/api/articles/:article_id/comments",
  validateSortAndOrder(validCommentSorts, validOrders),
  getCommentsByArticleId
);
app.post(
  "/api/articles/:article_id/comments",
  validateCommentInput,
  postCommentByArticleId
);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
