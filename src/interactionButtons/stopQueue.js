const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");
const { noMusicEmbed } = require("../utils/music");

module.exports = {
  name: "stop-queue",
  run: async (client, interaction, args) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    try {
      await queue.stop();

      const embed = new EmbedBuilder({
        description: ":stop_button: **Đã dừng phát nhạc!**",
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
