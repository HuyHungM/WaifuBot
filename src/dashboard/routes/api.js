const app = require("express").Router();
const client = require("../../app");

app.get("/api/get/manifest.json", (req, res) => {
  const manifest = {
    name: `${client.user.username} - Bot cho Discord`,
    short_name: client.user.username,
    start_url: "/",
    display: "standalone",
    background_color: "#18181b",
    theme_color: "#5868fa",
    icons: [
      {
        src: client.user.displayAvatarURL({ extension: "png" }),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: client.user.displayAvatarURL({ extension: "png" }),
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  res.json(manifest);
});

module.exports = app;
