const { findWaifu, updateWaifuMessage } = require("../../api/waifuAPI");

module.exports = {
  name: "chat",
  aliases: ["c"],
  category: "Waifu",
  description: "Nhắn tin với bot",
  usage: "chat <nội dung tin nhắn>",
  run: async (client, message, args) => {
    let waifuData = await findWaifu({ ownerID: message.author.id });
    if (!waifuData)
      return message.reply(
        "Bạn chưa khởi tạo waifu cho mình. Vui lòng dùng lênh waifu-create."
      );

    if (args.length == 0)
      return message.reply("Nhắn gì đó đi chứ, giận đó nha!");
    if (args.join(" ").length > 256)
      return message.reply("Giới hạn kí tự 256.");

    message.channel.sendTyping();

    waifuData.messages.push({ role: "user", content: args.join(" ") });
    await client.waifuai
      .create({
        messages: waifuData.messages,
        model: waifuData.model,
        max_tokens: 1000,
      })
      .then(async (res) => {
        message.reply(res.choices[0].message.content);

        waifuData.messages.push({
          role: "assistant",
          content: res.choices[0].message.content,
        });

        await updateWaifuMessage({
          ownerID: message.author.id,
          messages: waifuData.messages,
        });
      })
      .catch((error) => {
        message.channel.send("Đã xảy ra lỗi ", error);
      });
  },
};
