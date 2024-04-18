const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");
const volume = require("../../commands/Music/volume");

module.exports = {
  name: "volume",
  description: "Chỉnh âm lượng",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "number",
      description: "âm lượng",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  run: async (client, interaction, args) => {
    const queue = client.distube.getQueue(interaction);

    const volume = interaction.options.get("number").value;

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });
    if (volume > 125 || volume < 0) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Kiểu âm lượng không hợp lệ!** \`0 - 125\``,
      }).setColor(config.getEmbedConfig().color);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await client.distube.setVolume(queue, volume);

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
