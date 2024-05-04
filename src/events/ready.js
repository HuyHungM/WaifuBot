const { ActivityType, Events } = require("discord.js");

module.exports = (client) => {
  client.once(Events.ClientReady, async () => {
    console.log(`🟢 [LIVE]: BOT đã đăng nhập với tên ${client.user.tag}!`);

    client.user.setPresence({
      activities: [
        {
          name: "Đang làm người yêu bạn | w!help",
          type: ActivityType.Custom,
        },
      ],
      status: "online",
    });
  });
};
