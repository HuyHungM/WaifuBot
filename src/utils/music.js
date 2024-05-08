const { EmbedBuilder } = require("discord.js");
const config = require("../config/config");
const { QueueRepeatMode } = require("discord-player");

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

const loopModeEmote = {
  [QueueRepeatMode.OFF]: "⭕",
  [QueueRepeatMode.QUEUE]: "🔂",
  [QueueRepeatMode.TRACK]: "🔁",
};

const loopModeMessage = {
  [QueueRepeatMode.OFF]: "Tắt",
  [QueueRepeatMode.TRACK]: "Lặp lại bài hát",
  [QueueRepeatMode.QUEUE]: "Lặp lại hàng đợi",
};

const autoplayModeMessage = {
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

const volumeIcon = {
  low: "🔈",
  medium: "🔉",
  high: "🔊",
};

module.exports = {
  checkSameRoom,
  noMusicEmbed,
  filterSubCommand,
  loopModeEmote,
  loopModeMessage,
  autoplayModeMessage,
  volumeIcon,
};
