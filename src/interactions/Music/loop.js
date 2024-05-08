const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} = require("discord.js");
const config = require("../../config/config");
const {
  noMusicEmbed,
  loopModeEmote,
  loopModeMessage,
} = require("../../utils/music");
const { QueueRepeatMode } = require("discord-player");
const { commandCategory } = require("../../utils/other");

module.exports = {
  name: "loop",
  category: commandCategory.MUSIC,
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
          value: QueueRepeatMode.OFF,
        },
        {
          name: "Lặp lại bài hát",
          value: QueueRepeatMode.TRACK,
        },
        {
          name: "Lặp lại hàng đợi",
          value: QueueRepeatMode.QUEUE,
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
      let mode = undefined;
      mode = interaction?.options?.get("mode")?.value;

      mode = await queue.setRepeatMode(mode);

      const embed = new EmbedBuilder({
        description: `${loopModeEmote[mode]} **Đã chỉnh chế độ lặp lại thành** \`${loopModeMessage[mode]}\`**!**`,
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
