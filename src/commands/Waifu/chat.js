const { model } = require("../../config/AIConfig");
const { ownerName } = require("../../config/config");
const { commandCategory } = require("../../utils/other");

module.exports = {
  name: "chat",
  aliases: ["c"],
  category: commandCategory.WAIFU,
  description: "Nhắn tin với bot",
  usage: "chat <nội dung tin nhắn>",
  run: async (client, message, args) => {
    let waifuData = await client.waifuai.find({ ownerID: message.author.id });
    if (!waifuData)
      return message.reply(
        "Bạn chưa khởi tạo waifu cho mình. Vui lòng dùng lênh waifu-create."
      );

    if (args.length == 0)
      return message.reply("Nhắn gì đó đi chứ, giận đó nha!");
    if (args.join(" ").length > 256)
      return message.reply("Giới hạn kí tự 256.");

    if (!waifuData?.isReplied) return;

    try {
      message.channel.sendTyping();

      waifuData.messages.push({ role: "user", content: args.join(" ") });
      const res = await client.waifuai.createMessage({
        messages: waifuData.messages,
        waifuName: waifuData.name,
        model: model,
        ownerID: message.author.id,
        ownerName: message.author.username,
      });
      if (!res) return;

      message.reply(res.choices[0].message.content);
    } catch (error) {
      console.error(error);
      message.channel.send("Đã xảy ra lỗi!");
    }
  },
};
