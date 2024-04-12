module.exports = (client) => {
  client.once("ready", () => {
    client.user.setPresence({
      activities: [{ name: " làm người yêu bạn", type: "Competing" }],
      status: "online",
    });
    console.log(`🟢 [LIVE]: BOT đã đăng nhập với tên ${client.user.tag}!`);
  });
};
