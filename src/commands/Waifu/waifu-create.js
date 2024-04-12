require("dotenv").config();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const AIConfig = require("../../config/AIConfig");

module.exports = {
  name: "waifu-create",
  aliases: ["w-c"],
  category: "Waifu",
  description: "Tạo waifu cho bạn",
  usage: "waifu-create <tên>",
  run: async (client, message, args) => {
    const waifu = await db.get(`waifu.${message.author.id}`);
    if (waifu)
      return message.reply(
        "Bạn đã khởi tạo waifu cho riêng mình. Vui lòng dùng lệnh waifu-delete để tạo mới."
      );

    if (args.length == 0)
      return message.reply("Vui lòng đặt tên cho waifu của bạn.");

    const waifuData = {
      name: args.join(" "),
      ownerID: message.author.id,
      model: "gpt-3.5-turbo",
      messages: AIConfig.getStarterMessage(message, args),
    };

    await db.set(`waifu.${message.author.id}`, waifuData);
    message.reply(
      `Đã khởi tạo thành công waifu của bạn với tên \`${args.join(
        " "
      )}\`\nGiờ đây bạn có thể chat với em ấy với lệnh ${
        process.env.PREFIX
      }chat`
    );
  },
};
