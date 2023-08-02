module.exports = isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  else {
    return next(createError(505, "You have no acces to this page"));
  }
};
