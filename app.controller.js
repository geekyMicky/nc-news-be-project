const endpointsJson = require("./endpoints.json");
const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsbyArticleId,
  insertComment,
  updateArticleVotes,
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

  fetchAllArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by = "created_at", order = "DESC" } = req.query;

  fetchCommentsbyArticleId(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  fetchArticleById(article_id)
    .then(() => {
      return updateArticleVotes(article_id, inc_votes);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
