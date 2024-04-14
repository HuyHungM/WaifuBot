const { PermissionsBitField } = require("discord.js");
const config = require("../config/config");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton() || !interaction.inGuild()) return;
    const interactionID = interaction.customId;

    switch (true) {
      case interactionID.startsWith("song"):
        if (!interaction.member.voice.channel)
          return interaction.reply({
            content:
              "Bạn phải tham gia một kênh thoại trước khi sử dụng lệnh này!",
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

        const messageID = interactionID.substr(7);

        try {
          let searchedSong = client.searchedSongs.get(messageID);
          if (!searchedSong)
            return interaction.reply({
              content: "Đã xảy ra lỗi!",
              ephemeral: true,
            });

          const song = searchedSong[interactionID];

          await interaction.message.delete();
          await client.searchedSongs.delete(messageID);

          await client.distube.play(
            interaction.member.voice.channel,
            song.url,
            {
              member: interaction.member,
              textChannel: interaction.channel,
              interaction,
            }
          );
        } catch (error) {
          interaction.reply({
            content: "Đã xảy ra lỗi.",
            ephemeral: true,
          });
          client.searchedSongs.delete(messageID);
          console.log(error);
        }
        break;

      case interactionID.startsWith("close"):
        interaction.message.delete();
        break;
    }
  });
};
