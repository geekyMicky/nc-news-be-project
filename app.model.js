const db = require("./db/connection");

exports.fetchAllTopics = () => {
  return db
    .query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topics not found" });
      } else {
        return rows;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return rows[0];
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC") => {
  const validSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC"];

  if (!validSorts.includes(sort_by)) {
    sort_by = "created_at";
  }
  if (!validOrders.includes(order.toUpperCase())) {
    order = "DESC";
  }

  const queryText = `SELECT 
        articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        CAST(COUNT(comments.article_id) AS INT) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};`;

  return db
    .query(queryText)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Articles not found" });
      } else {
        return rows;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "DESC"
) => {
  const validSorts = ["comment_id", "votes", "created_at", "author", "body"];
  const validOrders = ["ASC", "DESC"];

  if (!validSorts.includes(sort_by)) {
    sort_by = "created_at";
  }
  if (!validOrders.includes(order.toUpperCase())) {
    order = "DESC";
  }
  const queryText = `SELECT *
        FROM comments
        WHERE article_id = $1
        ORDER BY ${sort_by} ${order};`;
  return db
    .query(queryText, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comments not found" });
      } else {
        return rows;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
