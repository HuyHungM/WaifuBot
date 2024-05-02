const { EmbedBuilder } = require("discord.js");
const config = require("../../config/config");
const { noMusicEmbed, filterSubCommand } = require("../../utils/music");

module.exports = {
  name: "filter",
  aliases: [],
  category: "Music",
  description: "Thêm filter cho bài hát",
  usage: `filter <add/remove/clear/actives/list> [tên filter]`,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);

    if (!queue) return message.reply({ embeds: [noMusicEmbed] });
    const subCommand = args[0]?.toLowerCase();
    const filter = args[1]?.toLowerCase();

    try {
      if (
        !subCommand ||
        !Object.values(filterSubCommand).includes(subCommand)
      ) {
        const embed = new EmbedBuilder({
          description: `${config.emotes.error} **Lệnh không hợp lệ!**
          \n**Ví dụ:** \`${process.env.PREFIX}filter <add/remove/clear/actives/list> [tên filter]\``,
        }).setColor(config.getEmbedConfig().color);
        return message.reply({ embeds: [embed] });
      }

      switch (subCommand) {
        case filterSubCommand.ADD:
          if (Object.keys(client.distube.filters).includes(filter)) {
            if (!queue.filters.has(filter)) await queue.filters.add(filter);

            const addEmbed = new EmbedBuilder({
              description: `**Đã thêm filter** \`${filter}\`**!**
            \n**Các filter hiện đang bật:** \n\`${queue.filters.names.join(
              ", "
            )}\``,
            }).setColor(config.getEmbedConfig().color);
            message.channel.send({ embeds: [addEmbed] });
          } else {
            const unavailableEmbed = new EmbedBuilder({
              title: "Không phải filter hợp lệ",
              description: `**Các filter hợp lệ gồm:**
              \n\`${Object.keys(client.distube.filters).join(" | ")}\``,
            }).setColor(config.getEmbedConfig().color);
            message.reply({ embeds: [unavailableEmbed] });
          }
          break;

        case filterSubCommand.REMOVE:
          if (Object.keys(client.distube.filters).includes(filter)) {
            if (queue.filters.has(filter)) await queue.filters.remove(filter);

            const removeEmbed = new EmbedBuilder({
              description: `**Đã loại bỏ filter** \`${filter}\`**!**
            \n${
              queue.filters.size > 0
                ? `**Các filter hiện đang bật:** \n\`${queue.filters.names.join(
                    ", "
                  )}\``
                : `${config.emotes.success} **Hiện không có filter nào đang bật!**`
            }`,
            }).setColor(config.getEmbedConfig().color);
            message.channel.send({ embeds: [removeEmbed] });
          } else {
            const unavailableEmbed = new EmbedBuilder({
              title: "Không phải filter hợp lệ",
              description: `**Các filter hợp lệ gồm:**
              \n\`${Object.keys(client.distube.filters).join(" | ")}\``,
            }).setColor(config.getEmbedConfig().color);
            message.reply({ embeds: [unavailableEmbed] });
          }
          break;

        case filterSubCommand.CLEAR:
          await queue.filters.clear();
          const clearEmbed = new EmbedBuilder({
            description: `${config.emotes.success} **Đã tắt filter!**`,
          }).setColor(config.getEmbedConfig().color);
          message.channel.send({ embeds: [clearEmbed] });
          break;

        case filterSubCommand.ACTIVES:
          const activesEmbed = new EmbedBuilder({
            description: `${
              queue.filters.size > 0
                ? `**Các filter hiện đang bật:** \n\`${queue.filters.names.join(
                    ", "
                  )}\``
                : `${config.emotes.success} **Hiện không có filter nào đang bật!**`
            }`,
          }).setColor(config.getEmbedConfig().color);
          message.channel.send({ embeds: [activesEmbed] });
          break;

        case filterSubCommand.LIST:
          const listEmbed = new EmbedBuilder({
            description: `${config.emotes.success} **Các loại filter:** 
          \n\`${Object.keys(client.distube.filters).join(" | ")}\``,
          }).setColor(config.getEmbedConfig().color);
          message.channel.send({ embeds: [listEmbed] });
          break;
      }
    } catch (error) {
      const embed = new EmbedBuilder({
        description: `${config.emotes.error} **Đã xảy ra lỗi!**`,
      }).setColor(config.getEmbedConfig().errorColor);
      message.reply({ embeds: [embed] });
      console.error(error);
    }
  },
};
