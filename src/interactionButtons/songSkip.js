const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");

module.exports = {
  name: "song-skip",
  run: async (client, interaction, args) => {
    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: "Bạn phải tham gia một kênh thoại trước khi sử dụng lệnh này!",
        ephemeral: true,
      });

    const messageID = args[1];

    try {
      await interaction.message.delete();

      await client.distube.play(interaction.member.voice.channel, args[0], {
        member: interaction.member,
        textChannel: interaction.channel,
        interaction,
        skip: true,
      });
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      console.error(error);
    }
  },
};
