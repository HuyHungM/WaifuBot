const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");
const { noMusicEmbed } = require("../utils/music");

module.exports = {
  name: "next-track",
  run: async (client, interaction, args) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });
    if (queue.songs.length <= 1 && !queue.autoplay) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Hàng đợi chỉ còn 1 bài hát, không thể skip!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (queue.paused) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Hàng đợi đang tạm dừng, không thể chuyển bài hát!**`,
      }).setColor(config.getEmbedConfig().color);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await queue.skip();
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      interaction.reply({ embeds: [embed], ephemeral: true });
      console.error(error);
    }
  },
};
