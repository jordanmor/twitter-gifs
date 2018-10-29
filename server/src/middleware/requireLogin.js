module.exports = (req, res, next) => {
  if (!req.user) {
    const err = new Error('You must log in to use this feature.');
    err.status = 401;
    return next(err);
  }
  next();
};