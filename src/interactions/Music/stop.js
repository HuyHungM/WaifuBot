const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "stop",
  description: "Dừng phát nhạc",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });
    await client.distube.stop();

    const embed = new EmbedBuilder({
      description: ":stop_button: **Đã dừng phát nhạc!**",
    }).setColor(config.getEmbedConfig().color);

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
