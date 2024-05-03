const {
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const config = require("../config/config");
const {
  noMusicEmbed,
  volumeIcon,
  loopModeMessage,
  autoplayModeMessage,
  loopModeEmote,
} = require("../utils/music");

module.exports = {
  name: "pause-queue",
  run: async (client, interaction, args) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    if (queue.paused) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Bài hát hiện đã tạm dừng!**`,
      }).setColor(config.getEmbedConfig().color);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await queue.pause();

      const song = queue.songs[0];

      const embedData = {
        title: `🎶  Hiện đang phát ♪`,
        description: `[${song.name}](${song.url}) - \`${song.formattedDuration}\` \n**   Yêu cầu bởi:** ${song.user}`,
        fields: [
          {
            name: `${
              queue.volume <= 35
                ? volumeIcon.low
                : queue.volume <= 70
                ? volumeIcon.medium
                : volumeIcon.high
            } Âm lượng: `,
            value: `\`${queue.volume}%\``,
            inline: true,
          },
          {
            name: "Chế độ lặp lại: ",
            value: `\`${loopModeMessage[queue.repeatMode]}\``,
            inline: true,
          },
          {
            name: "Tự động phát: ",
            value: `\`${autoplayModeMessage[queue.autoplay]}\``,
            inline: true,
          },
          {
            name: "Filters: ",
            value: `\`${queue.filters.names.join(", ") || "Tắt"}\``,
            inline: true,
          },
        ],
        thumbnail: {
          url: song.thumbnail,
        },
        footer: {
          text: config.getEmbedConfig().footer,
          iconURL: client.user.displayAvatarURL(),
        },
        timestamp: new Date(),
      };

      const embed = new EmbedBuilder(embedData).setColor(
        config.getEmbedConfig().color
      );

      // Create Button Row
      const rowComponents_1 = [
        new ButtonBuilder({
          custom_id: `autoplay ${queue.id}`,
          emoji: `🔎`,
          style: ButtonStyle.Primary,
        }),
        new ButtonBuilder({
          custom_id: `previous-track ${queue.id}`,
          emoji: "⏮",
          style: ButtonStyle.Primary,
        }),
        new ButtonBuilder({
          custom_id: `${queue.playing ? "pause-queue" : "resume-queue"} ${
            queue.id
          }`,
          emoji: `${queue.playing ? "⏸" : "▶"}`,
          style: ButtonStyle.Primary,
        }),
        new ButtonBuilder({
          custom_id: `next-track ${queue.id}`,
          emoji: "⏮",
          style: ButtonStyle.Primary,
        }),
        new ButtonBuilder({
          custom_id: `loop ${queue.id}`,
          emoji: `${loopModeEmote[queue.repeatMode]}`,
          style: ButtonStyle.Primary,
        }),
      ];

      const row_1 = new ActionRowBuilder({
        components: rowComponents_1,
      });

      const row_2 = new ActionRowBuilder({
        components: [
          new ButtonBuilder({
            custom_id: `stop-queue ${queue.id}`,
            emoji: "🛑",
            style: ButtonStyle.Danger,
          }),
        ],
      });

      //Send Info Message
      interaction.message.delete();
      let msg = await interaction.reply({
        embeds: [embed],
        components: [row_1, row_2],
      });
      client.playingSong.set(queue.textChannel.guildId, msg);
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      interaction.reply({ embeds: [embed], ephemeral: true });
      console.error(error);
    }
  },
};
