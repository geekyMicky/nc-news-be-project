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
  const checkArticleQuery = `SELECT * FROM articles WHERE article_id = $1;`;

  return db
    .query(checkArticleQuery, [article_id])
    .then(({ rows: articleRows }) => {
      if (articleRows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      const queryText = `
        SELECT *
        FROM comments
        WHERE article_id = $1
        ORDER BY ${sort_by} ${order};`;

      return db.query(queryText, [article_id]);
    })
    .then(({ rows: commentRows }) => {
      return commentRows;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.insertComment = (article_id, username, body) => {
  const insertCommentQuery = `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`;

  return db
    .query(insertCommentQuery, [article_id, username, body])
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryText = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;

  return db
    .query(queryText, [inc_votes, article_id])
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.fetchCommentByCommentId = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        return rows[0];
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .catch((err) => {
      return Promise.reject(err);
    });
};
