const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const discord = require("discord.js");
const config = require("../config/config");
const distube = require("distube");
const {
  volumeIcon,
  loopModeEmote,
  loopModeMessage,
  autoplayModeMessage,
} = require("../utils/music");

module.exports = (client) => {
  client.on(discord.Events.ClientReady, () => {
    client.distube
      .on(distube.Events.PLAY_SONG, async (queue, song) => {
        //Create Embed
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
        let msg = await queue.textChannel.send({
          embeds: [embed],
          components: [row_1, row_2],
        });
        client.playingSong.set(queue.textChannel.guildId, msg);
      })
      .on(distube.Events.ADD_SONG, (queue, song) => {
        //Create Embed
        const embedData = {
          title: "Thêm bài hát",
          description: `[${song.name}](${song.url})`,
          fields: [
            {
              name: "Tác giả",
              value: `\`${song.uploader.name}\``,
              inline: true,
            },
            {
              name: "Thời lượng",
              value: `\`${song.formattedDuration}\``,
              inline: true,
            },
          ],
        };

        const embed = new EmbedBuilder(embedData).setColor(
          config.getEmbedConfig().color
        );

        //Send Info Message
        queue.textChannel.send({ embeds: [embed] });
      })
      .on(distube.Events.ADD_LIST, (queue, playlist) => {
        //Create Embed
        const embedData = {
          title: "Thêm Playlist",
          description: `[${playlist.name}](${playlist.url})`,
          fields: [
            {
              name: "Số lượng",
              value: `\`${playlist.songs.length}\` bài hát`,
              inline: true,
            },
            {
              name: "Thời lượng",
              value: `\`${playlist.formattedDuration}\``,
              inline: true,
            },
          ],
        };

        const embed = new EmbedBuilder(embedData).setColor(
          config.getEmbedConfig().color
        );

        //Send Info Message
        queue.textChannel.send({ embeds: [embed] });
      })
      .on(distube.Events.ERROR, (channel, e) => {
        //Create Embed
        const embedData = {
          description: `${config.emotes.error} **Đã xảy ra lỗi:** ${e
            .toString()
            .slice(0, 1974)}`,
        };

        const embed = new EmbedBuilder(embedData).setColor(
          config.getEmbedConfig().errorColor
        );

        //Send Info Message
        channel.send({ embeds: [embed] });
        console.error(e);
      })
      .on(distube.Events.EMPTY, (queue) => {
        //Create Embed
        const embedData = {
          description: "❗**Kênh thoại trống! Đang rời khỏi kênh...**",
        };

        const embed = new EmbedBuilder(embedData).setColor(
          config.getEmbedConfig().errorColor
        );

        //Send Info Message
        queue.textChannel.send({ embeds: [embed] });
      })
      .on(distube.Events.SEARCH_NO_RESULT, (message, query) => {
        //Create Embed
        const embedData = {
          description: `${config.emotes.errors} **Không tìm thấy kết quả nào cho** \`${query}\`!`,
        };

        const embed = new EmbedBuilder(embedData).setColor(
          config.getEmbedConfig().errorColor
        );

        //Send Info Message
        message.channel.send({ embeds: [embed] });
      })
      .on(distube.Events.FINISH, (queue) => {
        //Create Embed
        const embedData = {
          description: `${config.emotes.success} **Đã phát xong hàng đợi!**`,
        };

        const embed = new EmbedBuilder(embedData).setColor(
          config.getEmbedConfig().color
        );

        //Send Info Message
        queue.textChannel.send({ embeds: [embed] });
      })
      .on(distube.Events.FINISH_SONG, async (queue, song) => {
        let message = client.playingSong.get(queue.textChannel.guildId);
        if (message) {
          await message.delete();
        }
      })
      .on(distube.Events.DISCONNECT, async (queue) => {
        let message = client.playingSong.get(queue.textChannel.guildId);
        if (message) {
          client.playingSong.delete(queue.textChannel.guildId);
        }
      });
  });
};
