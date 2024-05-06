const app = require("express").Router();
const ejs = require("ejs");
const { Auth, UnAuth } = require("../middlewares/auth");
const client = require("../../app");
const moment = require("moment");

app.get("/", (req, res) => {
  ejs.renderFile(
    "./src/dashboard/views/index.html",
    {
      client,
      moment,
      callbackURL: process.env.DOMAIN + process.env.CALLBACK_URL,
    },
    (err, html) => {
      if (err) {
        console.error(err);
      } else {
        res.status(404).send(html);
      }
    }
  );
});

app.get("/login", UnAuth, (req, res) => {
  ejs.renderFile(
    "./src/dashboard/views/login.html",
    { client },
    (err, html) => {
      if (err) {
        console.error(err);
      } else {
        res.status(404).send(html);
      }
    }
  );
});

app.get("/logout", Auth, (req, res) => {
  req.logout(function () {});
  res.redirect("/login");
});

module.exports = app;
