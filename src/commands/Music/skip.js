const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "skip",
  aliases: [],
  category: "Music",
  description: "Bỏ qua bài hát hiện tại",
  usage: `skip`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });
    if (queue.songs.length <= 1 && !queue.autoplay) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Hàng đợi chỉ còn 1 bài hát, không thể skip!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      return message.reply({ embeds: [embed] });
    }

    try {
      const embed = new EmbedBuilder({
        description: `:track_next: **Đã bỏ qua bài** \`${queue.songs[0].name}\`**!**`,
      }).setColor(config.getEmbedConfig().color);

      await queue.skip();

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
