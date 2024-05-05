const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { model } = require("../../config/AIConfig");
const { commandCategory } = require("../../utils/other");

module.exports = {
  name: "chat",
  category: commandCategory.WAIFU,
  description: "Nhắn tin với bot",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "message",
      description: "tin nhắn",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    let waifuData = await client.waifuai.find({
      ownerID: interaction.user.id,
    });
    if (!waifuData)
      return interaction.reply({
        content:
          "Bạn chưa khởi tạo waifu cho mình. Vui lòng dùng lênh waifu-create.",
        ephemeral: true,
      });

    const message = interaction.options.get("message");

    if (message.value.length > 256)
      return interaction.reply({
        content: "Giới hạn kí tự 256.",
        ephemeral: true,
      });

    const messageState = await client.waifuai.findMessageState({
      ownerID: interaction.user.id,
    });

    if (!messageState?.isReplied) return;

    await client.waifuai.updateMessageState({
      state: false,
      ownerID: interaction.user.id,
    });

    waifuData.messages.push({ role: "user", content: message.value });

    try {
      interaction.reply({ content: "`Đang soạn...`", ephemeral: true });
      const res = await client.waifuai.createMessage({
        messages: waifuData.messages,
        model: model,
      });

      interaction.editReply(res.choices[0].message.content);

      if (res?.choices[0]?.message?.content?.toLowerCase().includes("error")) {
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
        ownerID: interaction.user.id,
        messages: waifuData.messages,
      });

      await client.waifuai.updateMessageState({
        state: true,
        ownerID: interaction.user.id,
      });
    } catch (error) {
      interaction.reply({ content: "Đã xảy ra lỗi", ephemeral: true });
      await client.waifuai.updateMessageState({
        state: true,
        ownerID: interaction.user.id,
      });
    }
  },
};
