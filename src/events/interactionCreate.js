module.exports = (client) => {
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;
    if (!interaction.inGuild())
      return interaction.reply({
        content: "Slash Command chỉ có thể sử dụng trong server",
        ephemeral: true,
      });

    const { commandName } = interaction;
    const command = client.interactions.get(commandName);
    if (command) {
      console.log(command);
      command.run(client, interaction);
    }
  });
};
