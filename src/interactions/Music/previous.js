const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "previous",
  description: "Phát bài hát trước đó",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    if (!queue.previousSongs || queue.previousSongs.length === 0) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Bài hát trước đó không tồn tại!**`,
      }).setColor(config.getEmbedConfig().color);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const previousSong = await client.distube.previous(queue);

      const embed = new EmbedBuilder({
        description: `:track_previous: **Đã phát bài hát trước đó** \`${previousSong.name}\` - \`${previousSong.formattedDuration}\` **!**`,
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
