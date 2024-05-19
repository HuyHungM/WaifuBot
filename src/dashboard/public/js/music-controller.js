if (!socket) {
  const socket = io();
}

$(document).ready(function () {
  $(".controller #autoplay-btn").on("click", function () {
    if ($(this).hasClass("disable")) return;
    console.log("hi");

    socket.emit("toggleAutoplayPlayback", { guildId });
  });

  $(".controller #previous-btn").on("click", function () {
    if ($(this).hasClass("disable")) return;

    socket.emit("previousSong", { guildId });
  });

  $(".controller #next-btn").on("click", function () {
    if ($(this).hasClass("disable")) return;

    socket.emit("nextSong", { guildId });
  });

  $(".controller #play-btn").on("click", function () {
    if ($(this).hasClass("disable")) return;

    if ($(this).find("i").hasClass("fa-play")) {
      socket.emit("resumePlayback", { guildId });
    } else if ($(this).find("i").hasClass("fa-pause")) {
      socket.emit("pausePlayback", { guildId });
    }
  });

  $(".controller #loop-btn").on("click", function () {
    if ($(this).hasClass("disable")) return;

    socket.emit("setRepeatModePlayback", { guildId });
  });
});
