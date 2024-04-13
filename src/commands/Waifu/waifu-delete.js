const { deleteMessageState } = require("../../api/messageAPI");
const { findWaifu, deleteWaifu } = require("../../api/waifuAPI");

module.exports = {
  name: "waifu-delete",
  aliases: ["w-delete"],
  category: "Waifu",
  description: "Xoá waifu cho bạn",
  usage: "waifu-delete",
  run: async (client, message, args) => {
    const waifuData = await findWaifu({ ownerID: message.author.id });
    if (!waifuData) return message.reply("Waifu của bạn chưa tồn tại");

    await message.author.dmChannel?.messages?.fetch().then((messages) => {
      messages
        .filter((message) => message.author.id === client.user.id)
        .forEach(async (msg) => {
          await msg.delete();
        });
    });
    await message.author.dmChannel?.delete();

    const deleteWaifuData = await deleteWaifu({
      ownerID: message.author.id,
    });

    const deleteDelayStateData = await deleteMessageState({
      ownerID: message.author.id,
    });

    if (deleteWaifuData == 1 && deleteDelayStateData == 1)
      message.reply(`Đã xoá thành công waifu của bạn.`);
    else message.reply("Đã xảy ra lỗi khi xoá waifu cho bạn.");
  },
};
