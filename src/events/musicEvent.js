const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");

module.exports = (client) => {
  client.on("ready", () => {
    client.distube
      .on("playSong", async (queue, song) => {
        let vol = {
          low: "🔈",
          medium: "🔉",
          high: "🔊",
        };

        //Create Embed
        const embedData = {
          title: `🎶  Hiện đang phát ♪`,
          description: `[${song.name}](${song.url}) - \`${song.formattedDuration}\` \n**   Yêu cầu bởi:** ${song.user}`,
          fields: [
            {
              name: `${
                queue.volume <= 35
                  ? vol.low
                  : queue.volume <= 70
                  ? vol.medium
                  : vol.high
              } Âm lượng: `,
              value: `\`${queue.volume}%\``,
              inline: true,
            },
            {
              name: "Chế độ lặp lại: ",
              value: `\`${
                queue.repeatMode
                  ? queue.repeatMode === 2
                    ? "Lặp lại hàng đợi"
                    : "Lặp lại bài hát"
                  : "Tắt"
              }\``,
              inline: true,
            },
            {
              name: "Tự động phát: ",
              value: `\`${queue.autoplay ? "Bật" : "Tắt"}\``,
              inline: true,
            },
            {
              name: "Filters: ",
              value: `\`${queue.filters.values.join(", ") || "Tắt"}\``,
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

        //Send Info Message
        let msg = await queue.textChannel.send({ embeds: [embed] });
        client.playingSong.set(queue.id, msg);
      })
      .on("addSong", (queue, song) => {
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
      .on("addList", (queue, playlist) => {
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
      .on("error", (channel, e) => {
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
      .on("empty", (queue) => {
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
      .on("searchNoResult", (message, query) => {
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
      .on("finish", (queue) => {
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
      .on("finishSong", async (queue, song) => {
        let msg = client.playingSong.get(queue.id);
        await msg.delete();
      })
      .on("disconnect", async (queue) => {
        let msg = client.playingSong.get(queue.id);
        if (msg) {
          await msg.delete();
        }
      });
  });
};
