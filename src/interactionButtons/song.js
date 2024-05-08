const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");
const { checkSameRoom } = require("../utils/music");
const { useMainPlayer } = require("discord-player");

module.exports = {
  name: "song",
  run: async (client, interaction, args) => {
    // if (
    //   checkSameRoom({ message: null, interaction: interaction, client: client })
    // )
    //   return;

    try {
      await interaction.message.delete();

      const player = useMainPlayer();

      await player.play(interaction.member.voice.channel, args[0], {
        requestedBy: interaction.author,
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
