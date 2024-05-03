const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandType,
} = require("discord.js");
const config = require("../../config/config.js");
const { noMusicEmbed } = require("../../utils/music.js");
const { commandCategory } = require("../../utils/other.js");
const dash = "▬";
const button = "🔘";

module.exports = {
  name: "queue",
  category: commandCategory.MUSIC,
  description: "Xem danh sách bài hát đang phát",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction) => {
    const queue = await client.distube.getQueue(interaction);
    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    const waitingMessageEmbed = new EmbedBuilder({
      description: `🔎 **Đang tải...**`,
    }).setColor(config.getEmbedConfig().color);

    const waitingMessage = await interaction.reply({
      embeds: [waitingMessageEmbed],
    });

    try {
      const playingSong = queue.songs[0];

      function nowPlaying() {
        const curSong = queue.currentTime;
        const durSong = playingSong.duration;
        const percent = (curSong / durSong) * 15;

        const str = `\`${queue.formattedCurrentTime}\` | ${dash.repeat(
          percent - 1
        )}${button.repeat(percent - (percent - 1))}${dash.repeat(
          16 - percent
        )} | \`${playingSong.formattedDuration}\``;
        return str;
      }

      const totalPages = Math.ceil(queue.songs.length / 10);

      let description = queue.songs
        .map(
          (song, i) =>
            `${
              i === 0
                ? `**🎶 Hiện đang phát:** \n[${song.name}](${song.url}) - \`${
                    song.formattedDuration
                  }\` ${queue.songs.length > 1 ? ` \n\n**Hàng chờ:**` : ""}`
                : `\`${i}.\` [${song.name}](${song.url}) - \`${song.formattedDuration}\`\n`
            }`
        )
        .slice(0, 10)
        .join("\n");

      let embed = new EmbedBuilder({
        title: `Hàng đợi ${interaction.guild.name}`,
        thumbnail: {
          url: playingSong.thumbnail,
        },
        footer: {
          text: `Trang - 1/${totalPages} | ${config.getEmbedConfig().footer}`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        },
        description: description,
        fields: [
          {
            name: "Tổng bài hát:",
            value: `\`${queue.songs.length}\``,
            inline: true,
          },
          {
            name: "Tổng thời lượng:",
            value: `\`${queue.formattedDuration}\``,
            inline: true,
          },
          {
            name: "Trạng thái:",
            value: `\`${queue.playing ? "Đang phát" : "Tạm dừng"}\``,
            inline: true,
          },
          {
            name: "Thời lượng bài hát hiện tại:",
            value: nowPlaying(),
            inline: false,
          },
        ],
        timestamp: new Date(),
      }).setColor(config.getEmbedConfig().color);

      const rowComponents = [
        new ButtonBuilder({
          custom_id: `close ${waitingMessage.id}`,
          label: "X",
          style: ButtonStyle.Danger,
        }),
      ];

      if (totalPages > 1) {
        rowComponents.push(
          new ButtonBuilder({
            custom_id: `next-queue 1`,
            emoji: "▶",
            style: ButtonStyle.Primary,
          })
        );
      }

      const row = new ActionRowBuilder({
        components: rowComponents,
      });

      await waitingMessage.edit({ embeds: [embed], components: [row] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      waitingMessage.edit({ embeds: [errorEmbed], components: [] });
      console.error(error);
    }
  },
};
