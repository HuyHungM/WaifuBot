const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed, autoplayModeMessage } = require("../../utils/music");
const { QueueRepeatMode } = require("discord-player");
const { commandCategory } = require("../../utils/other");

module.exports = {
  name: "autoplay",
  category: commandCategory.MUSIC,
  description: "Chỉnh chế độ tự động phát",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });
    if (queue.repeatMode != QueueRepeatMode.DISABLED) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Vui lòng tắt chế độ lặp!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      let mode = await queue.toggleAutoplay();

      const embed = new EmbedBuilder({
        description: `${config.emotes.success} **Đã chỉnh chế độ tự động phát lại thành** \`${autoplayModeMessage[mode]}\`**!**`,
      }).setColor(config.getEmbedConfig().color);

      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      interaction.reply({ embeds: [embed], ephemeral: true });
      console.error(error);
    }
  },
};
