const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "pause",
  aliases: [],
  category: "Music",
  description: "Tạm dừng bài hát",
  usage: `pause`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });

    if (queue.paused) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Bài hát hiện đã tạm dừng!**`,
      }).setColor(config.getEmbedConfig().color);

      return message.reply({ embeds: [embed] });
    }

    try {
      await client.distube.pause(queue);

      const embed = new EmbedBuilder({
        description: `:arrow_forward: **Đã tạm dừng bài hát!**`,
      }).setColor(config.getEmbedConfig().color);

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      message.reply({ embeds: [embed] });
      console.log(error);
    }
  },
};
