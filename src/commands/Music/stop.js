const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "stop",
  aliases: [],
  category: "Music",
  description: "Dừng phát nhạc",
  usage: `stop`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });
    await client.distube.stop(queue);

    const embed = new EmbedBuilder({
      description: ":stop_button: **Đã dừng phát nhạc!**",
    }).setColor(config.getEmbedConfig().color);

    message.channel.send({ embeds: [embed] });
  },
};
