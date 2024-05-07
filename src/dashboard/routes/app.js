const app = require("express").Router();
const ejs = require("ejs");
const { Auth, UnAuth } = require("../middlewares/auth");
const client = require("../../app");
const moment = require("moment");
const { PermissionsBitField } = require("discord.js");

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

app.get("/servers", Auth, (req, res) => {
  if (req.query.guild_id) return res.redirect(`/server/${req.query.guild_id}`);

  const user = req.user;

  user.guilds = user.guilds.filter((guild) => {
    const hasPermission = new PermissionsBitField(guild.permissions_new).has(
      PermissionsBitField.Flags.ManageGuild,
      true
    );
    if (hasPermission) {
      guild.inGuild = client.guilds.cache.has(guild.id);
      return guild;
    }
  });

  ejs.renderFile(
    "./src/dashboard/views/servers.html",
    {
      client,
      domain: process.env.DOMAIN,
      user,
      moment,
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
    { client, callbackURL: process.env.CALLBACK_URL },
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
