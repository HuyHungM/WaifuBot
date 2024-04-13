const { findWaifu, updateWaifuMessage } = require("../../api/waifuAPI");

module.exports = {
  name: "dm-chat",
  aliases: ["dm", "dm-c", "ib"],
  category: "Waifu",
  description: "Nhắn riêng với bot",
  usage: "dm-chat",
  run: async (client, message, args) => {
    let waifuData = await findWaifu({ ownerID: message.author.id });
    if (!waifuData)
      return message.reply(
        `Bạn chưa khởi tạo waifu cho mình. Vui lòng dùng lênh ${process.env.PREFIX}waifu-create.`
      );

    if (!message.author.dmChannel) {
      message.author.createDM();
      message.author.send("Chào anh nhé :heart:");
    }
  },
};
