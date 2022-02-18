const db = require("./db/connection");

exports.checkArticleIdExists = (id) => {
  return db
    .query(`SELECT article_id FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows: [articleExists] }) => {
      if (!articleExists) {
        return Promise.reject({ status: 404, message: "ID does not exist" });
      }
    });
};
