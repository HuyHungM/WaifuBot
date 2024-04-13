module.exports = (client) => {
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const prefix = process.env.PREFIX;
    if (!message.content.startsWith(prefix)) {
      if (message.guild) return;

      const args = message.content.trim().split(/ +/g);

      let command = client.commands.get("chat");
      command.run(client, message, args);
    } else {
      if (!message.guild) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      let command = client.commands.get(cmd);

      if (!command) command = client.commands.get(client.aliases.get(cmd));
      if (command) {
        console.log(command);
        command.run(client, message, args);
      }
    }
  });
};
