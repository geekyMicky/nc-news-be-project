const handlePSQLErrors = (err, req, res, next) => {
  const errorCodes = {
    23503: { status: 404, msg: "Topic or article or user not found" },
    "22P02": { status: 400, msg: "Invalid input" },
  };

  if (errorCodes[err.code]) {
    const { status, msg } = errorCodes[err.code];
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { handlePSQLErrors, handleCustomErrors, handleServerErrors };
