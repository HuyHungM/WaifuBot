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
  description: "Nghe nhạc cùng waifu của bạn",
  usage: `play <tên/link nhạc> (Youtube/Spotify/SoundCloud)`,
  run: async (client, message, args) => {
    if (checkSameRoom({ message: message, interaction: null, client: client }))
      return;

    const permissions = message.member.voice.channel.permissionsFor(
      message.client.user
    );
    if (
      !permissions.has(PermissionsBitField.Flags.Connect) ||
      !permissions.has(PermissionsBitField.Flags.Speak)
    ) {
      return message.reply(
        "Em chưa có quyền để kết nối hay phát phát nhạc trong kênh này!"
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

    try {
      const searchOptions = {
        limit: 5,
        type: SearchResultType.VIDEO,
        safeSearch: false,
      };

      const searchResult = (
        await client.distube.search(args.join(" "), searchOptions)
      ).sort((a, b) => (a.views < b.views ? 1 : -1));

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
            `\`${i + 1}.\` **${song.name}** - \`${
              song.uploader.name
            }\`\n__Views:__ \`${song.views.toLocaleString("vi-VN")}\``
        )
        .join("\n\n");

      const embedData = {
        title: "Anh muốn nghe bài nào ạ :heart:",
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
