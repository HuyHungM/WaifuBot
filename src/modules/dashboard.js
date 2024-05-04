const express = require("express");
const { static } = require("express");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { readdirSync } = require("fs");
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const { OAuth2Scopes, Events } = require("discord.js");

module.exports = (client) => {
  client.once(Events.ClientReady, function () {
    app.use(static("./src/dashboard/public"));

    app.use(bodyParser.json());

    app.use(
      session({
        secret: generateRandomString(16),
        resave: false,
        saveUninitialized: false,
      })
    );

    passport.use(
      new DiscordStrategy(
        {
          clientID: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET_ID,
          callbackURL: `${process.env.DOMAIN}:${process.env.PORT}${process.env.CALLBACK_URL}`,
          scope: `${OAuth2Scopes.Identify} ${OAuth2Scopes.Guilds} ${OAuth2Scopes.GuildsJoin} ${OAuth2Scopes.Email}`,
        },
        function (accessToken, refreshToken, profile, done) {
          process.nextTick(function () {
            return done(null, profile);
          });
        }
      )
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.get(
      process.env.CALLBACK_URL,
      passport.authenticate("discord", {
        failureRedirect: process.env.FAILURE_REDIRECT,
      }),
      (req, res) => {
        res.redirect("/");
      }
    );

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });

    const routes = readdirSync("./src/dashboard/routes").filter((file) =>
      file.endsWith(".js")
    );

    for (let file of routes) {
      const route = require(`../dashboard/routes/${file}`);
      app.use("/", route);
    }
    app.use((req, res, next) => {
      ejs.renderFile(
        "./src/dashboard/views/error.html",
        { client },
        (err, html) => {
          if (err) {
            console.error(err);
            // xử lý lỗi ở đây nếu cần
          } else {
            res.status(404).send(html);
          }
        }
      );
    });

    app.listen(process.env.PORT, () =>
      console.log(
        `🟢 [DASHBOARD]: Dashboard đã được mở tại địa chỉ ${process.env.DOMAIN}:${process.env.PORT}`
      )
    );
    app.set("view engine", "ejs");
  });
};

function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
