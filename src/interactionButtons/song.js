const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const config = require("../config/config");

module.exports = {
  name: "song",
  run: async (client, interaction, args) => {
    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: "Bạn phải tham gia một kênh thoại trước khi sử dụng lệnh này!",
        ephemeral: true,
      });

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

    const messageID = args[1];

    try {
      let searchedSong = client.searchedSongs.get(messageID);
      if (!searchedSong) {
        const embed = new EmbedBuilder({
          description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
        }).setColor(config.getEmbedConfig().errorColor);
        return interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      const song = searchedSong[interaction.customId];

      await interaction.message.delete();
      await client.searchedSongs.delete(messageID);

      await client.distube.play(interaction.member.voice.channel, song.url, {
        member: interaction.member,
        textChannel: interaction.channel,
        interaction,
      });
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      client.searchedSongs.delete(messageID);
      console.log(error);
    }
  },
};
