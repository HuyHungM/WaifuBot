const app = require("express").Router();

app.get("/api/get/user", (req, res) => {
  const user = req.user;
  if (user) {
    return res.status(200).json({ user: user });
  } else {
    return res.status(404).json({ user: null });
  }
});

module.exports = app;
