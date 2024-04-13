const { ApplicationCommandType } = require("discord.js");
const { findWaifu, updateWaifuMessage } = require("../../api/waifuAPI");

module.exports = {
  name: "dm-chat",
  description: "Nhắn riêng với bot",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (client, interaction) => {
    let waifuData = await findWaifu({ ownerID: interaction.member.id });
    if (!waifuData)
      return interaction.reply({
        content: `Bạn chưa khởi tạo waifu cho mình. Vui lòng dùng lênh ${process.env.PREFIX}waifu-create.`,
        ephemeral: true,
      });

    interaction.member.createDM();
    interaction.reply({
      content: `Bạn có thể qua <@${client.user.id}> để chat tiếp.`,
      ephemeral: true,
    });
  },
};
