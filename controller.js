
const { selectTopics, selectArticlesById } = require("./model");


exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};


exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticlesById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
