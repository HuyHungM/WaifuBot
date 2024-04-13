const { findWaifu } = require("../../api/waifuAPI");

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

    message.author.createDM();
    message.reply(`Bạn có thể qua <@${client.user.id}> để chat tiếp.`);
  },
};
