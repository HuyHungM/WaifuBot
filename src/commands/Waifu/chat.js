const { model } = require("../../config/AIConfig");

module.exports = {
  name: "chat",
  aliases: ["c"],
  category: "Waifu",
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

    const messageState = await client.waifuai.findMessageState({
      ownerID: message.author.id,
    });

    if (!messageState.isReplied) return;

    await client.waifuai.updateMessageState({
      state: false,
      ownerID: message.author.id,
    });

    message.channel.sendTyping();

    waifuData.messages.push({ role: "user", content: args.join(" ") });
    await client.waifuai
      .createMessage({
        messages: waifuData.messages,
        model: model,
      })
      .then(async (res) => {
        message.reply(res.choices[0].message.content);

        if (
          res?.choices[0]?.message?.content?.toLowerCase().includes("error")
        ) {
          return await client.waifuai.updateMessageState({
            state: true,
            ownerID: message.author.id,
          });
        }

        waifuData.messages.push({
          role: "assistant",
          content: res.choices[0].message.content,
        });

        waifuData.messages.push({
          role: "system",
          content: `Bạn tên là ${waifuData.name}`,
        });

        await client.waifuai.updateMessage({
          ownerID: message.author.id,
          messages: waifuData.messages,
        });

        await client.waifuai.updateMessageState({
          state: true,
          ownerID: message.author.id,
        });
      })
      .catch(async (error) => {
        console.error(error);
        message.channel.send("Đã xảy ra lỗi!");
        await client.waifuai.updateMessageState({
          state: true,
          ownerID: message.author.id,
        });
      });
  },
};
