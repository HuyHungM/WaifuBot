module.exports = (client) => {
  client.once("ready", () => {
    client.user.setPresence({
      activities: [{ name: " làm người yêu bạn", type: "Competing" }],
      status: "idle",
    });
    console.log(`🟢 [LIVE]: BOT đã đăng nhập với tên ${client.user.tag}!`);
  });
};
