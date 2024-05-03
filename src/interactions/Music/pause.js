const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");
const { commandCategory } = require("../../utils/other");

module.exports = {
  name: "pause",
  category: commandCategory.MUSIC,
  description: "Tạm dừng bài hát",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    if (queue.paused) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Bài hát hiện đã tạm dừng!**`,
      }).setColor(config.getEmbedConfig().color);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await queue.pause();

      const embed = new EmbedBuilder({
        description: `:arrow_forward: **Đã tạm dừng bài hát!**`,
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
