const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");
const { RepeatMode } = require("distube");

const checkSameRoom = ({ message, interaction, client }) => {
  if (message) {
    if (!message.member.voice.channelId) {
      return message.reply({
        content: "Bạn phải vào kênh thoại để sử dụng lệnh này!",
        ephemeral: true,
      });
    }

    if (
      !client.distube.getQueue(message.guildId)?.voiceChannel?.id ||
      client.distube.getQueue(message.guildId)?.voiceChannel?.id ===
        message.member.voice.channelId
    )
      return;
    else {
      return message.reply({
        content: "Bạn phải vào chung phòng với bot để sử dụng lệnh này!",
        ephemeral: true,
      });
    }
  } else {
    if (!interaction.member.voice.channelId)
      return interaction.reply({
        content: "Bạn phải vào kênh thoại để sử dụng lệnh này!",
        ephemeral: true,
      });

    if (
      !client.distube.getQueue(interaction.guildId)?.voiceChannel?.id ||
      client.distube.getQueue(interaction.guildId)?.voiceChannel?.id ===
        interaction.member.voice.channelId
    )
      return;
    else {
      return interaction.reply({
        content: "Bạn phải vào chung phòng với bot để sử dụng lệnh này!",
        ephemeral: true,
      });
    }
  }
};

const noMusicEmbed = new EmbedBuilder({
  description: `${config.emotes.error} **Hiện tại không có bài hát nào đang phát!**`,
}).setColor(config.getEmbedConfig().errorColor);

const loopModeEmotes = {
  [RepeatMode.DISABLED]: config.emotes.success,
  [RepeatMode.SONG]: ":repeat_one:",
  [RepeatMode.QUEUE]: ":repeat:",
};

const loopModeMessages = {
  [RepeatMode.DISABLED]: "Tắt",
  [RepeatMode.SONG]: "Lặp lại bài hát",
  [RepeatMode.QUEUE]: "Lặp lại hàng đợi",
};

const autoplayModeMessages = {
  [false]: "Tắt",
  [true]: "Bật",
};

const filterSubCommand = {
  ADD: "add",
  REMOVE: "remove",
  CLEAR: "clear",
  ACTIVES: "actives",
  LIST: "list",
};

module.exports = {
  checkSameRoom,
  noMusicEmbed,
  filterSubCommand,
  loopModeEmotes,
  loopModeMessages,
  autoplayModeMessages,
};
