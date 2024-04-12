require("dotenv").config();

module.exports = (client) => {
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    const prefix = process.env.PREFIX;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd);

    if (!command) command = client.commands.get(client.aliases.get(cmd));
    command.run(client, message, args);
  });
};
