const { SearchResultType } = require("distube");
const {
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const config = require("../../config/config");
const { checkSameRoom } = require("../../utils/music");

module.exports = {
  name: "play",
  description: "Phát nhạc từ Youtube/Spotify/SoundCloud",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "link-or-query",
      description: "tên/link bài hát",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    checkSameRoom({ message: null, interaction: interaction, client: client });

    const permissions = interaction.member.voice.channel.permissionsFor(
      interaction.client.user
    );
    if (
      !permissions.has(PermissionsBitField.Flags.Connect) ||
      !permissions.has(PermissionsBitField.Flags.Speak)
    ) {
      return interaction.reply({
        content:
          "Bot không có quyền tham gia hoặc phát âm thanh trong kênh này!",
        ephemeral: true,
      });
    }

    // searching embed
    const searchingEmbedData = {
      description: "🔎 **Đang tìm kiếm...**",
    };

    const searchingEmbed = new EmbedBuilder(searchingEmbedData).setColor(
      config.getEmbedConfig().color
    );

    const searchingMessage = await interaction.reply({
      embeds: [searchingEmbed],
      ephemeral: false,
    });

    const searchOptions = {
      limit: 5,
      type: SearchResultType.VIDEO,
      safeSearch: false,
    };

    try {
      const searchResult = (
        await client.distube.search(
          interaction.options.get("link-or-query").value,
          searchOptions
        )
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
        .sort((a, b) => (a.views < b.views ? 1 : -1))
        .map(
          (song, i) =>
            `\`${i + 1}.\` **${song.name}** - \`${
              song.uploader.name
            }\`\n__Views:__ \`${song.views.toLocaleString("vi-VN")}\``
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
        ephemeral: false,
      });
    } catch (error) {
      const errorEmbed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      searchingMessage.edit({
        embeds: [errorEmbed],
        components: [],
        ephemeral: true,
      });
      client.searchedSongs.delete(searchingMessage.id);
      console.log(error);
    }
  },
};
