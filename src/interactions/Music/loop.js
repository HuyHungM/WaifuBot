const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed } = require("../../utils/music");
const { RepeatMode } = require("distube");

module.exports = {
  name: "loop",
  description: "Chỉnh chế độ lặp",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "mode",
      description: "Chế độ lặp",
      required: false,
      type: ApplicationCommandOptionType.Integer,
      choices: [
        {
          name: "Tắt",
          value: RepeatMode.DISABLED,
        },
        {
          name: "Lặp lại bài hát",
          value: RepeatMode.SONG,
        },
        {
          name: "Lặp lại hàng đợi",
          value: RepeatMode.QUEUE,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });
    if (queue.autoplay) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Vui lòng tắt chế độ tự động phát!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      let mode = interaction?.options?.get("mode")?.value || undefined;

      mode = await client.distube.setRepeatMode(queue, mode);

      const modeEmotes = {
        [RepeatMode.DISABLED]: config.emotes.success,
        [RepeatMode.SONG]: ":repeat_one:",
        [RepeatMode.QUEUE]: ":repeat:",
      };

      const modeMessages = {
        [RepeatMode.DISABLED]: "Tắt",
        [RepeatMode.SONG]: "Lặp lại bài hát",
        [RepeatMode.QUEUE]: "Lặp lại hàng đợi",
      };

      const embed = new EmbedBuilder({
        description: `${modeEmotes[mode]} **Đã chỉnh chế độ lặp lại thành** \`${modeMessages[mode]}\`**!**`,
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
