const config = require("../config/config");
const { Player } = require("discord-player");
const { Collection } = require("discord.js");
const { default: DeezerExtractor } = require("discord-player-deezer");

module.exports = async (client) => {
  const player = new Player(client);
  await player.extractors.register(DeezerExtractor);
  await player.extractors.loadDefault();

  client.playingSong = new Collection();
};
