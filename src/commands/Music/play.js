const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../../config/config");
const { commandCategory } = require("../../utils/other");
const { useMainPlayer } = require("discord-player");

module.exports = {
  name: "play",
  aliases: ["p"],
  category: commandCategory.MUSIC,
  description: "Nghe nhạc cùng waifu của bạn",
  usage: `play <tên/link nhạc>`,
  run: async (client, message, args) => {
    const songQuery = args.join(" ");
    if (songQuery.trim() === "") {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Vui lòng nhập tên/link bài hát!**`,
      }).setColor(config.getEmbedConfig().color);
      return message.reply({ embeds: [embed] });
    }

    // searching embed
    const searchingEmbedData = {
      description: "🔎 **Đang tìm kiếm...**",
    };

    const searchingEmbed = new EmbedBuilder(searchingEmbedData).setColor(
      config.getEmbedConfig().color
    );

    const searchingMessage = await message.channel.send({
      embeds: [searchingEmbed],
    });

    try {
      const player = useMainPlayer();

      const urlRegex = /^(?:https?|ftp):\/\/[\w/\-?=%.]+\.[\w/\-?=%.]+$/;
      if (urlRegex.test(songQuery)) {
        await player.play(message.member.voice.channel, songQuery, {
          requestedBy: message.author,
        });
        // await client.distube.play(message.member.voice.channel, songQuery, {
        //   member: message.member,
        //   textChannel: message.channel,
        //   message,
        // });

        return await searchingMessage.delete();
      }

      const searchOptions = {
        fallbackSearchEngine: "youtube",
        requestedBy: message.author,
      };

      const searchResult = (
        await player.search(songQuery, searchOptions)
      )._data.tracks
        ?.sort((a, b) => (a.views < b.views ? 1 : -1))
        .slice(0, 5);
      console.log(searchResult);

      if (!searchResult) {
        const embed = new EmbedBuilder({
          description: `${config.emotes.error} **Không tìm thấy kết quả nào cho** \`${songQuery}\` **!**`,
        }).setColor(config.getEmbedConfig().color);
        return message.reply({ embeds: [embed] });
      }

      // Create Embed
      const embedDescription = searchResult
        .map(
          (song, i) =>
            `\`${i + 1}.\` **${song.raw.title}** - \`${
              song.raw.channel.name
            }\`\n__Views:__ \`${song.raw.views.toLocaleString(
              "vi-VN"
            )}\` - __Thời lượng:__ \`${song.raw.durationFormatted}\``
        )
        .join("\n\n");

      const embedData = {
        title: "🔎 Kết quả tìm kiếm...",
        description: embedDescription,
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
      const rowData = {
        components: searchResult.map((song, index) => {
          const buttonId = `song ${song.url}`;
          return new ButtonBuilder({
            custom_id: buttonId,
            label: `${index + 1}`,
            style: ButtonStyle.Primary,
          });
        }),
      };

      const closeRowData = {
        components: [
          new ButtonBuilder({
            custom_id: `close ${searchingMessage.id}`,
            label: "X",
            style: ButtonStyle.Danger,
          }),
        ],
      };

      const row = new ActionRowBuilder(rowData);
      const closeRow = new ActionRowBuilder(closeRowData);

      searchingMessage.edit({
        embeds: [embed],
        components: [row, closeRow],
      });
    } catch (error) {
      const errorEmbed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      searchingMessage.edit({ embeds: [errorEmbed], components: [] });
      console.error(error);
    }
  },
};
