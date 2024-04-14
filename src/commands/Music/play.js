const { SearchResultType } = require("distube");
const {
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../../config/config");
const { checkSameRoom } = require("../../utils/music");

module.exports = {
  name: "play",
  aliases: ["p"],
  category: "Music",
  description: "Phát nhạc từ Youtube/Spotify/SoundCloud",
  usage: `play <tên/link nhạc>`,
  run: async (client, message, args) => {
    if (checkSameRoom({ message: message, interaction: null, client: client }))
      return;

    // if (!message.member.voice.channel)
    //   return message.reply(
    //     "Bạn phải tham gia một kênh thoại trước khi sử dụng lệnh này!"
    //   );

    const permissions = message.member.voice.channel.permissionsFor(
      message.client.user
    );
    if (
      !permissions.has(PermissionsBitField.Flags.Connect) ||
      !permissions.has(PermissionsBitField.Flags.Speak)
    ) {
      return message.reply(
        "Bot không có quyền tham gia hoặc phát âm thanh trong kênh này!"
      );
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

    const searchOptions = {
      limit: 5,
      type: SearchResultType.VIDEO,
      safeSearch: false,
    };

    try {
      const searchResult = await client.distube.search(
        args.join(" "),
        searchOptions
      );

      const searchedSong = Object.fromEntries(
        searchResult.map((song, index) => [
          `song_${index + 1}_${searchingMessage.id}`,
          { url: song.url },
        ])
      );

      client.searchedSongs.set(searchingMessage.id, searchedSong);

      // Create Embed
      const embedDescription = searchResult
        .map(
          (song, i) =>
            `\`${i + 1}.\` **${song.name}** - \`${song.uploader.name}\``
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
        components: Array.from({ length: 5 }, (_, index) => {
          const buttonId = `song_${index + 1}_${searchingMessage.id}`;
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
            custom_id: `close_${searchingMessage.id}`,
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
      client.searchedSongs.delete(searchingMessage.id);
      console.log(error);
    }
  },
};
