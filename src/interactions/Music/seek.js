const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");
const ms = require("ms");

module.exports = {
  name: "seek",
  description: "Tua thời lượng bài hát",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "duration",
      description: "Khoảng thời gian (h/m/s)",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    try {
      let duration = interaction.options.get("duration").value;

      let time = 0;

      for (let i = 0; i < args.length; i++) {
        time += ms(duration);
      }
      i /= 1000;

      if (isNaN(time)) {
        const embed = new EmbedBuilder({
          description: `${config.emotes.error} **Vui lòng nhập khoảng thời gian hợp lệ! (h/m/s)**`,
        }).setColor(config.getEmbedConfig().errorColor);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      if (time > queue.songs[0].duration) {
        const embed = new EmbedBuilder({
          description: `${config.emotes.error} **Giá trị nhập vào lớn hơn thời lượng bài hát!**`,
        }).setColor(config.getEmbedConfig().errorColor);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await client.distube.seek(queue, time);

      const embed = new EmbedBuilder({
        description: `:fast_forward: **Đã tua đến** \`${queue.formattedCurrentTime}\`**!**`,
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
