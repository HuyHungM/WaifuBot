const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "volume",
  aliases: ["vol"],
  category: "Music",
  description: "Chỉnh âm lượng",
  usage: `volume <âm lượng>`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });
    if (isNaN(args[0]) || Number(args[0]) > 125 || Number(args[0]) < 0) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Kiểu âm lượng không hợp lệ!** \`0 - 125\``,
      }).setColor(config.getEmbedConfig().color);

      return message.reply({ embeds: [embed] });
    }

    try {
      const volume = await client.distube.setVolume(queue, Number(args[0]));

      let vol = {
        low: "🔈",
        medium: "🔉",
        high: "🔊",
      };

      const embed = new EmbedBuilder({
        description: `${
          volume <= 35 ? vol.low : volume <= 70 ? vol.medium : vol.high
        } **Đã chỉnh âm lượng thành** \`${volume}\` **!**`,
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
