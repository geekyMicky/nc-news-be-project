const express = require("express");
const {
  getAllNews,
  getAllTopics,
  getArticleById,
  getAllArticles,
} = require("./api.controller");

const app = express();

app.get("/api", getAllNews);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
