const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");
const { RepeatMode } = require("distube");

module.exports = {
  name: "autoplay",
  description: "Chỉnh chế độ tự động phát",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction, args) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });
    if (queue.repeatMode != RepeatMode.DISABLED) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Vui lòng tắt chế độ lặp!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      let mode = await client.distube.toggleAutoplay(queue);

      const modeMessages = {
        [false]: "Tắt",
        [true]: "Bật",
      };

      const embed = new EmbedBuilder({
        description: `${config.emotes.success} **Đã chỉnh chế độ lặp lại thành** \`${modeMessages[mode]}\`**!**`,
      }).setColor(config.getEmbedConfig().color);

      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      interaction.reply({ embeds: [embed], ephemeral: true });
      console.log(error);
    }
  },
};
