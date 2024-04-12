const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "chat",
  aliases: ["c", "ib"],
  category: "Waifu",
  description: "AI chat bot",
  usage: "chat <nội dung tin nhắn>",
  run: async (client, message, args) => {
    const waifu = await db.get(`waifu.${message.author.id}`);
    if (!waifu)
      return message.reply(
        "Bạn chưa khởi tạo waifu cho mình. Vui lòng dùng lênh waifu-create."
      );

    if (args.length == 0)
      return message.reply("Nhắn gì đó đi chứ, giận đó nha!");
    if (args.join(" ").length > 256)
      return message.reply("Giới hạn kí tự 256.");

    message.channel.sendTyping();

    waifu.messages.push({ role: "user", content: args.join(" ") });
    await client.waifuai
      .create({
        messages: waifu.messages,
        model: waifu.model,
        max_tokens: 1000,
      })
      .then(async (res) => {
        message.channel.send(res.choices[0].message.content);

        waifu.messages.push({
          role: "assistant",
          content: res.choices[0].message.content,
        });

        await db.set(`waifu.${message.author.id}`, waifu);
      })
      .catch((error) => {
        message.channel.send("Đã xảy ra lỗi ", error);
      });
  },
};
