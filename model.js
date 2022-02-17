const db = require("./db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesById = (id) => {
  return db
    .query(
      `SELECT articles.*, 
    COUNT(comments.comment_id)::INT
    AS comment_count 
    FROM articles
    JOIN comments 
    ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, message: "ID does not exist" });
      return rows[0];
    });
};

exports.increaseArticleVote = (id, newVotes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [newVotes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectUsers = () => {
  return db.query("SELECT username FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT article_id, title, topic, author, created_at, votes FROM articles"
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectCommentsById = (id) => {
  return db
    .query(
      `SELECT * FROM comments 
      WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
