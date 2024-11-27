const endpointsJson = require("./endpoints.json");
const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
} = require("./app.model");

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
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by = "created_at", order = "DESC" } = req.query;

  const validSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  const validOrders = ["ASC", "DESC"];

  if (!validSorts.includes(sort_by) || !validOrders.includes(order)) {
    return res.status(400).send({ msg: "Invalid sort_by or order parameter" });
  }

  fetchAllArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by = "created_at", order = "DESC" } = req.query;

  const validSorts = ["comment_id", "votes", "created_at", "author"];
  const validOrders = ["ASC", "DESC"];

  if (
    !validSorts.includes(sort_by) ||
    !validOrders.includes(order.toUpperCase())
  ) {
    return res.status(400).send({ msg: "Invalid sort_by or order parameter" });
  }

  fetchCommentsByArticleId(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: "Invalid input" });
  }

  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
