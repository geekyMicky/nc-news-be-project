const endpointsJson = require("./endpoints.json");
const { fetchAllTopics, fetchArticleById } = require("./app.model");

exports.getAllNews = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    return next({ status: 400, msg: "Bad Request" });
  }
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
