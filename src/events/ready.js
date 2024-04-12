module.exports = (client) => {
  client.once("ready", () => {
    client.user.setPresence({
      activities: [{ name: "trò làm người yêu bạn", type: "PLAYING" }],
      status: "idle",
    });
    console.log(`🟢 [LIVE]: BOT đã đăng nhập với tên ${client.user.tag}!`);
  });
};
