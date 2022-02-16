const express = require("express");
const app = express();
const { getTopics, getArticlesById, patchArticle } = require("./controller");
const {
  handlePSQLerrors,
  customErrors,
  handle500s,
} = require("./error-handling");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.patch("/api/articles/:article_id", patchArticle);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

app.use(handlePSQLerrors);
app.use(customErrors);
app.use(handle500s);

module.exports = app;
