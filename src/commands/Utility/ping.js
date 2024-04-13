const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config.js");

module.exports = {
  name: "ping",
  aliases: [""],
  category: "Utility",
  description: "Ping của bot",
  usage: "ping",
  run: (client, message, args) => {
    let circles = {
      green: "🟢",
      yellow: "🟡",
      red: "🔴",
    };
    const latency = Date.now() - message.createdTimestamp;
    const ws = client.ws.ping;
    const vcLatency = "N/A";

    const embedData = {
      title: ":ping_pong: . . . pong!",
      fields: [
        {
          name: "📶 **|** API",
          value: `${
            latency <= 200
              ? circles.green
              : latency <= 400
              ? circles.yellow
              : circles.red
          } **\`${latency}\`** ms`,
          inline: true,
        },
        {
          name: "🌐 **|** WebSocket",
          value: `${
            ws <= 200 ? circles.green : ws <= 400 ? circles.yellow : circles.red
          } **\`${ws}\`** ms`,
          inline: true,
        },
        {
          name: "🔊 **|** Voice",
          value: `**\`${vcLatency}\`** ms`,
          inline: true,
        },
      ],
      footer: {
        text: `Ping của ${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      },
      timestamp: new Date(),
    };

    const embed = new EmbedBuilder(embedData).setColor(
      config.getEmbedConfig().color
    );

    message.channel.send({ embeds: [embed] });
  },
};
