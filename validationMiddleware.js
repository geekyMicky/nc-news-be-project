const validateSortAndOrder = (validSorts, validOrders) => (req, res, next) => {
  const { sort_by = "created_at", order = "DESC" } = req.query;

  if (
    !validSorts.includes(sort_by) ||
    !validOrders.includes(order.toUpperCase())
  ) {
    return res.status(400).send({ msg: "Invalid sort_by or order parameter" });
  }

  next();
};

const validateCommentInput = (req, res, next) => {
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: "Invalid input" });
  }

  next();
};

module.exports = { validateSortAndOrder, validateCommentInput };
