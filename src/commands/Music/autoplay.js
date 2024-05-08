const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed, autoplayModeMessage } = require("../../utils/music");
const { QueueRepeatMode } = require("discord-player");
const { commandCategory } = require("../../utils/other");

module.exports = {
  name: "autoplay",
  aliases: [],
  category: commandCategory.MUSIC,
  description: "Chỉnh chế độ tự động phát",
  usage: `autoplay`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });
    if (queue.repeatMode != QueueRepeatMode.OFF) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Vui lòng tắt chế độ lặp!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      return message.reply({ embeds: [embed] });
    }

    try {
      let mode = await queue.toggleAutoplay();

      const embed = new EmbedBuilder({
        description: `${config.emotes.success} **Đã chỉnh chế độ tự động phát lại thành** \`${autoplayModeMessage[mode]}\`**!**`,
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
