function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.name === "ZodError") {
    return res.status(400).json({ error: err.issues });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = { errorHandler };
