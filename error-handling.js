exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.handlePSQLerrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  } else next(err);
};
