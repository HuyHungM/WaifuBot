module.exports = {
  name: "close",
  run: async (client, interaction, args) => {
    await interaction.message.delete();
  },
};
