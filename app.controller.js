const endpointsJson = require("./endpoints.json");
const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  checkTopicExists,
  fetchCommentsByArticleId,
  fetchAllUsers,
  insertComment,
  updateArticleVotes,
  fetchCommentByCommentId,
  removeComment,
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
  const { sort_by = "created_at", order = "DESC", topic } = req.query;

  const fetchArticles = () =>
    fetchAllArticles(sort_by, order, topic).then((articles) => {
      res.status(200).send({ articles });
    });

  if (topic) {
    checkTopicExists(topic)
      .then(() => {
        return fetchArticles();
      })
      .catch(next);
  } else {
    return fetchArticles().catch(next);
  }
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by = "created_at", order = "DESC" } = req.query;

  fetchCommentsByArticleId(article_id, sort_by, order)
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

  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  fetchCommentByCommentId(comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  fetchCommentByCommentId(comment_id)
    .then(() => {
      return removeComment(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
