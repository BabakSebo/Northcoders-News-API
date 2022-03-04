const db = require("./db/connection");
const format = require("pg-format");

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
    LEFT JOIN comments 
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

exports.selectArticles = ({ sort_by, order, topic }) => {
  let queryStr =
    "SELECT articles.*, COUNT(comments.article_id):: INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ";
  let sortByQuery = `ORDER BY articles.created_at `;
  if (sort_by) {
    if (
      !["title", "article_id", "topic", "author", "body", "votes"].includes(
        sort_by
      )
    ) {
      return Promise.reject({ status: 400, message: "invalid query" });
    }
    sortByQuery = `ORDER BY ${sort_by} `;
  }

  if (order) {
    if (!["ASC", "DESC"].includes(order)) {
      return Promise.reject({ status: 400, message: "invalid query" });
    }
    sortByQuery += `${order} `;
  } else {
    sortByQuery += `DESC `;
  }

  const queryValues = [];
  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  queryStr += `GROUP BY articles.article_id ` + sortByQuery;
  return db.query(queryStr, queryValues).then(({ rows }) => {
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

exports.addComments = (id, author, body) => {
  return db
    .query(
      `INSERT INTO comments
    (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *`,
      [id, author, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComments = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [id])
    .then(({ rowCount }) => {
      if (rowCount === 0)
        return Promise.reject({ status: 404, message: "ID does not exist" });
      return rowCount[0];
    });
};
