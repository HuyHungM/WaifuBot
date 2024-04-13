const { ChannelType } = require("discord.js");

module.exports = (client) => {
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.DM) {
      console.log("hi");
      const args = message.content.trim().split(/ +/g);

      let command = client.commands.get("chat");
      return command.run(client, message, args);
    }

    const prefix = process.env.PREFIX;
    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd);

    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
      command.run(client, message, args);
    }
  });
};
