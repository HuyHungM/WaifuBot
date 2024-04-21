const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "previous",
  aliases: ["prev", "previous-song", "prev-song"],
  category: "Music",
  description: "Phát bài hát trước đó",
  usage: `previous`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });

    if (!queue.previousSongs || queue.previousSongs.length === 0) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Bài hát trước đó không tồn tại!**`,
      }).setColor(config.getEmbedConfig().color);

      return message.reply({ embeds: [embed] });
    }

    try {
      const previousSong = await client.distube.previous(queue);

      const embed = new EmbedBuilder({
        description: `:track_previous: **Đã phát bài hát trước đó** \`${previousSong.name}\` - \`${previousSong.formattedDuration}\` **!**`,
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
