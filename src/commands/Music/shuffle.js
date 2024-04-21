const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "shuffle",
  aliases: [],
  category: "Music",
  description: "Xáo trộn hàng đợi",
  usage: `shuffle`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });

    try {
      await client.distube.shuffle(queue);

      const embed = new EmbedBuilder({
        description: `:twisted_rightwards_arrows: **Đã xáo trộn hàng đợi!**`,
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
