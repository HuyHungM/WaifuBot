const { RepeatMode, SearchResultType } = require("distube");
const { model } = require("../../config/AIConfig");

module.exports = (client, io) => {
  io.on("connection", (socket) => {
    // Music
    socket.on("getMusicData", async function ({ guildId, userId }) {
      const queue = client.distube.getQueue(guildId);
      const queueData = {
        autoplay: queue?.autoplay || false,
        songs: queue?.songs || [],
        repeatMode: queue?.repeatMode || RepeatMode.DISABLED,
        volume: queue?.volume || 50,
        currentTime: queue?.currentTime,
        formattedCurrentTime: queue?.formattedCurrentTime,
        previousSongs: queue?.previousSongs,
        playing: queue?.playing,
        paused: queue?.paused,
        textChannel: queue?.textChannel,
        voiceChannel: queue?.voiceChannel,
      };

      socket.emit(`getMusicData-${userId}`, queueData);
    });

    socket.on("searchSong", async ({ songQuery, userId }) => {
      const searchOptions = {
        limit: 25,
        type: SearchResultType.VIDEO,
        safeSearch: false,
      };

      const searchResult = (
        await client.distube.search(songQuery, searchOptions)
      )?.sort((a, b) => (a.views < b.views ? 1 : -1));

      socket.emit(`searchSong-${userId}`, searchResult);
    });

    socket.on(
      "playSong",
      async ({ guildId, userId, voiceChannelId, textChannelId, songUrl }) => {
        const voiceChannel = await client.channels.resolve(voiceChannelId);
        const textChannel = await client.channels.resolve(textChannelId);
        const guild = await client.guilds.resolve(guildId);
        const member = await guild.members.resolve(userId);

        await client.distube.play(voiceChannel, songUrl, {
          member: member,
          textChannel: textChannel,
        });
      }
    );

    socket.on(
      "playSkipSong",
      async ({ userId, voiceChannelId, textChannelId, songUrl }) => {
        const voiceChannel = client.channels.fetch(voiceChannelId);
        const textChannel = client.channels.fetch(textChannelId);
        const member = client.users.fetch(userId);

        await client.distube.play(voiceChannel, songUrl, {
          member: member,
          textChannel: textChannel,
          skip: true,
        });
      }
    );

    socket.on("stopQueue", async ({ guildId }) => {
      const queue = client.distube.getQueue(guildId);
      await queue.stop();
    });

    socket.on("pausePlayback", async ({ guildId }) => {
      const queue = client.distube.getQueue(guildId);
      await queue.pause();
    });

    socket.on("resumePlayback", async ({ guildId }) => {
      const queue = client.distube.getQueue(guildId);
      await queue.resume();
    });

    socket.on("nextSong", async ({ guildId }) => {
      const queue = client.distube.getQueue(guildId);
      await queue.skip();
    });

    socket.on("previousSong", async ({ guildId }) => {
      const queue = client.distube.getQueue(guildId);
      await queue.previous();
    });

    socket.on("toggleAutoplayPlayback", async ({ guildId }) => {
      const queue = client.distube.getQueue(guildId);
      await queue.toggleAutoplay();
    });

    socket.on("setRepeatModePlayback", async ({ guildId }) => {
      const queue = client.distube.getQueue(guildId);
      await queue.setRepeatMode(undefined);
    });

    // Waifu
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
