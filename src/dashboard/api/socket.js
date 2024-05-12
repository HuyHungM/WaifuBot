const { RepeatMode } = require("distube");

module.exports = (client, io) => {
  io.on("connection", (socket) => {
    socket.on("getMusicData", async function ({ guildId }) {
      const queue = client.distube.getQueue(guildId);
      const queueData = {
        autoplay: queue?.autoplay || false,
        songs: queue?.songs || [],
        repeatMode: queue?.repeatMode || RepeatMode.DISABLED,
        volume: queue?.volume || 50,
        currentTime: queue?.currentTime || null,
        formattedCurrentTime: queue?.formattedCurrentTime || null,
      };
      socket.emit("getMusicData", queueData);
    });
  });
};
