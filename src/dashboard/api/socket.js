const { RepeatMode } = require("distube");
const { model } = require("../../config/AIConfig");

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

    socket.on(
      "sendWaifuMessage",
      async function ({ userId, userName, message }) {
        const waifuData = await client.waifuai.find({ ownerID: userId });
        if (!waifuData) return;
        if (!waifuData.isReplied) return;

        try {
          waifuData.messages.push({ role: "user", content: message });
          const res = await client.waifuai.createMessage({
            messages: waifuData.messages,
            waifuName: waifuData.name,
            model: model,
            ownerID: userId,
            ownerName: userName,
          });

          socket.emit(`sendWaifuMessage-${userId}`, res);
        } catch (error) {
          console.error(error);
          return socket.emit(`sendWaifuMessage-${userId}`, null);
        }
      }
    );
  });
};
