const express = require("express");
const { getAllNews } = require("./api.controller");

const app = express();

app.get("/api", getAllNews);

module.exports = app;
