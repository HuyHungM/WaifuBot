const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");

module.exports = {
  name: "skipto",
  description: "Bỏ qua bài hát đến một vị trí nhất định",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "position",
      description: "Vị trí",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    const position = interaction.options.get("position").value;

    if (position > queue.songs.length || position < 1) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Vị trí không hợp lệ!** \`1 - ${queue.songs.length}\``,
      }).setColor(config.getEmbedConfig().color);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const skipToSong = await client.distube.jump(queue, position);

      if (skipToSong) {
        const embed = new EmbedBuilder({
          description: `:track_next: **Đã bỏ qua đến bài** \`${
            skipToSong.name
          }\`**!**\n**Hàng đợi còn** \`${queue.songs.length - 1}\` bài`,
        }).setColor(config.getEmbedConfig().color);

        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      interaction.reply({ embeds: [embed], ephemeral: true });
      console.log(error);
    }
  },
};
