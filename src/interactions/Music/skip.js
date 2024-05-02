const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "skip",
  description: "Bỏ qua bài hát hiện tại",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    if (queue.songs.length <= 1 && !queue.autoplay) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Hàng đợi chỉ còn 1 bài hát, không thể skip!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const embed = new EmbedBuilder({
        description: `:track_next: **Đã bỏ qua bài** \`${queue.songs[0].name}\`**!**`,
      }).setColor(config.getEmbedConfig().color);

      await queue.skip();

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
