const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");
const { RepeatMode } = require("distube");

module.exports = {
  name: "loop",
  aliases: ["repeat"],
  category: "Music",
  description: "Chỉnh chế độ lặp",
  usage: `loop [queue | song | off]`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });
    if (queue.autoplay) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Vui lòng tắt chế độ tự động phát!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      message.reply({ embeds: [embed] });
    }

    try {
      let mode = undefined;

      switch (args[0]) {
        case "off":
          mode = RepeatMode.DISABLED;
          break;
        case "song":
          mode = RepeatMode.SONG;
          break;
        case "queue":
          mode = RepeatMode.QUEUE;
          break;
        default:
          mode = mode;
          break;
      }

      mode = await client.distube.setRepeatMode(queue, mode);

      const modeEmotes = {
        [RepeatMode.DISABLED]: config.emotes.success,
        [RepeatMode.SONG]: ":repeat_one:",
        [RepeatMode.QUEUE]: ":repeat:",
      };

      const modeMessages = {
        [RepeatMode.DISABLED]: "Tắt",
        [RepeatMode.SONG]: "Lặp lại bài hát",
        [RepeatMode.QUEUE]: "Lặp lại hàng đợi",
      };

      const embed = new EmbedBuilder({
        description: `${modeEmotes[mode]} **Đã chỉnh chế độ lặp lại thành** \`${modeMessages[mode]}\`**!**`,
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
