const { RepeatMode } = require("distube");

module.exports = (client, io) => {
  io.on("connection", (socket) => {
    socket.on("getMusicData", async function ({ guildId, userId }) {
      const queue = client.distube.getQueue(guildId);
      const queueData = {
        autoplay: queue?.autoplay || false,
        songs: queue?.songs || [],
        repeatMode: queue?.repeatMode || RepeatMode.DISABLED,
        volume: queue?.volume || 50,
        currentTime: queue?.currentTime || null,
        formattedCurrentTime: queue?.formattedCurrentTime || null,
      };
      socket.emit(`getMusicData-${userId}`, queueData);
    });

    socket.on("getWaifuData", async function ({ userId }) {
      const waifu = await client.waifuai.find({ ownerID: userId });
      socket.emit(`getWaifuData-${userId}`, waifu);
    });
  });
};
