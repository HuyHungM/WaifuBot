const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");
const { commandCategory } = require("../../utils/other");

module.exports = {
  name: "shuffle",
  aliases: [],
  category: commandCategory.MUSIC,
  description: "Xáo trộn hàng đợi",
  usage: `shuffle`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });

    try {
      await queue.shuffle();

      const embed = new EmbedBuilder({
        description: `:twisted_rightwards_arrows: **Đã xáo trộn hàng đợi!**`,
      }).setColor(config.getEmbedConfig().color);

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      message.reply({ embeds: [embed] });
      console.error(error);
    }
  },
};
