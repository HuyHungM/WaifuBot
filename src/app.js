require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { readdirSync } = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = readdirSync("./src/commands/");

readdirSync("./src/handlers")
  .filter((file) => file.endsWith(".js"))
  .forEach((handler) => {
    require(`./handlers/${handler}`)(client);
  });

client.login(process.env.TOKEN);
