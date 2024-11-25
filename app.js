const express = require("express");
const { getAllNews, getAllTopics } = require("./api.controller");

const app = express();

app.get("/api", getAllNews);

app.get("/api/topics", getAllTopics);

app.use((req, res, next) => {
  res.status(404).send({ error: "Not Found" });
});

module.exports = app;
