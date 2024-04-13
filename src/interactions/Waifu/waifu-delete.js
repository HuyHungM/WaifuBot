const { ApplicationCommandType } = require("discord.js");
const { deleteMessageState } = require("../../api/messageAPI");
const { findWaifu, deleteWaifu } = require("../../api/waifuAPI");

module.exports = {
  name: "waifu-delete",
  description: "Xoá waifu cho bạn",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction) => {
    const waifuData = await findWaifu({ ownerID: interaction.user.id });
    if (!waifuData)
      return interaction.reply({
        content: "Waifu của bạn chưa tồn tại",
        ephemeral: true,
      });

    await interaction.user.dmChannel?.messages?.fetch().then((messages) => {
      messages
        .filter((message) => message.author.id === client.user.id)
        .forEach(async (msg) => {
          await msg.delete();
        });
    });
    await interaction.user.dmChannel?.delete();

    const deleteWaifuData = await deleteWaifu({
      ownerID: interaction.user.id,
    });

    const deleteDelayStateData = await deleteMessageState({
      ownerID: interaction.user.id,
    });

    if (deleteWaifuData == 1 && deleteDelayStateData == 1)
      interaction.reply({
        content: `Đã xoá thành công waifu của bạn.`,
        ephemeral: true,
      });
    else
      interaction.reply({
        content: "Đã xảy ra lỗi khi xoá waifu cho bạn.",
        ephemeral: true,
      });
  },
};
