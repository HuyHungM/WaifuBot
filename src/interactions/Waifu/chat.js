const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const {
  findMessageState,
  updateMessageState,
} = require("../../api/messageAPI");
const { findWaifu, updateWaifuMessage } = require("../../api/waifuAPI");

module.exports = {
  name: "chat",
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
    let waifuData = await findWaifu({ ownerID: interaction.user.id });
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

    const messageState = await findMessageState({
      ownerID: interaction.user.id,
    });

    if (!messageState?.isReplied) return;

    await updateMessageState({
      state: false,
      ownerID: interaction.user.id,
    });

    waifuData.messages.push({ role: "user", content: message.value });

    try {
      interaction.reply({ content: "`Đang soạn...`", ephemeral: true });
      const res = await client.waifuai.create({
        messages: waifuData.messages,
        model: waifuData.model,
        max_tokens: 1000,
      });

      interaction.editReply(res.choices[0].message.content);

      waifuData.messages.push({
        role: "assistant",
        content: res.choices[0].message.content,
      });

      await updateWaifuMessage({
        ownerID: interaction.user.id,
        messages: waifuData.messages,
      });

      await updateMessageState({
        state: true,
        ownerID: interaction.user.id,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: "Đã xảy ra lỗi", ephemeral: true });
      await updateMessageState({
        state: true,
        ownerID: interaction.user.id,
      });
    }
  },
};
