const express = require("express");
const app = express();
const { getTopics } = require("./controller");

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

module.exports = app;
