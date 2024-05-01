const Auth = (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  else next();
};

const UnAuth = (req, res, next) => {
  if (req.user) return res.redirect("/servers");
  else next();
};

module.exports = { Auth, UnAuth };
