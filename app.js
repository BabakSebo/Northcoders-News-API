const express = require("express");
const app = express();
const { getTopics, getArticlesById } = require("./controller");
const { handlePSQLerrors, customErrors } = require("./error-handling");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

app.use(handlePSQLerrors);
app.use(customErrors);

module.exports = app;
