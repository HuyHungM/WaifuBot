const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "resume",
  aliases: [],
  category: "Music",
  description: "Tiếp tục bài hát",
  usage: `resume`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });

    if (queue.playing) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Bài hát hiện đang phát!**`,
      }).setColor(config.getEmbedConfig().color);

      return message.reply({ embeds: [embed] });
    }

    try {
      await client.distube.resume(queue);

      const embed = new EmbedBuilder({
        description: `:arrow_forward: **Đã tiếp tục bài hát!**`,
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
