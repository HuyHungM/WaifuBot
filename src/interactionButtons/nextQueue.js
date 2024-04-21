const { ButtonStyle } = require("discord.js");
const { noMusicEmbed } = require("../utils/music");
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const config = require("../config/config.js");

const dash = "▬";
const button = "🔘";

module.exports = {
  name: "next-queue",
  run: async (client, interaction, args) => {
    const queue = client.distube.getQueue(interaction);

    if (!queue)
      return interaction.reply({ embeds: [noMusicEmbed], ephemeral: true });

    const currentPage = Number(args[0]) + 1;
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
      .slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10)
      .join("\n");

    let embed = new EmbedBuilder({
      title: `Hàng đợi ${interaction.guild.name}`,
      thumbnail: {
        url: playingSong.thumbnail,
      },
      footer: {
        text: `Trang - ${currentPage}/${totalPages} | ${
          config.getEmbedConfig().footer
        }`,
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
          name: "Yêu cầu bởi:",
          value: `\`${playingSong.user.username}\``,
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

    const rowComponents = [];

    if (currentPage > 1) {
      rowComponents.push(
        new ButtonBuilder({
          custom_id: `previous-queue_${currentPage}`,
          emoji: "◀",
          style: ButtonStyle.Primary,
        })
      );
    }

    rowComponents.push(
      new ButtonBuilder({
        custom_id: `close_${interaction.message.id}`,
        label: "X",
        style: ButtonStyle.Danger,
      })
    );

    if (totalPages > 1 && currentPage < totalPages) {
      rowComponents.push(
        new ButtonBuilder({
          custom_id: `next-queue_${currentPage}`,
          emoji: "▶",
          style: ButtonStyle.Primary,
        })
      );
    }

    const row = new ActionRowBuilder({
      components: rowComponents,
    });

    await interaction.message.edit({ embeds: [embed], components: [row] });
  },
};
