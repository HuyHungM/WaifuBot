const socket = io();

const loopModeMessage = {
  [RepeatMode.DISABLED]: "Tắt",
  [RepeatMode.SONG]: "Bài hát",
  [RepeatMode.QUEUE]: "Hàng đợi",
};

const autoplayModeMessage = {
  [false]: "Tắt",
  [true]: "Bật",
};

const dash = "▬";
const button = "🔘";

function nowPlaying(queue) {
  const curSong = queue.currentTime;
  const durSong = queue.songs[0].duration;
  const percent = (curSong / durSong) * 21;

  const str = ` | ${dash.repeat(percent - 1)}${button.repeat(1)}${dash.repeat(
    21 - percent
  )} | `;
  return str;
}

$(document).ready(function () {
  const getDistubeData = setInterval(function () {
    socket.emit("getMusicData", { guildId });
  }, 1000);

  socket.on("getMusicData", function (queue) {
    $(".queue-info .songs .middle h1").text(queue.songs.length);
    $(".queue-info .autoplay .middle h1").text(
      autoplayModeMessage[queue.autoplay]
    );
    $(".queue-info .loop .middle h1").text(loopModeMessage[queue.repeatMode]);
    $(".queue-info .volume .middle h1").text(`${queue.volume}%`);

    if (queue.songs.length > 0) {
      if ($(".now-playing .background-cover").length > 0) {
        $(".now-playing .background-cover").attr(
          "src",
          queue.songs[0].thumbnail
        );
      } else {
        $(document.createElement("img"))
          .attr("src", queue.songs[0].thumbnail)
          .addClass("background-cover")
          .appendTo($(".now-playing"));
      }
    } else {
      if ($(".now-playing .background-cover"))
        $(".now-playing .background-cover").remove();
    }

    $(".now-playing .current-song a")
      .attr("href", `${queue.songs.length > 0 ? queue.songs[0].url : "#"}`)
      .attr("target", `${queue.songs.length > 0 ? "_blank" : "_self"}`)
      .text(
        queue.songs.length > 0 ? queue.songs[0].name : "Hiện đang trống..."
      );
    $(".now-playing .duration .hover-text").text(
      queue.songs.length > 0
        ? nowPlaying(queue)
        : "Hiện tại không có gì đang phát, thêm trên discord chứ?"
    );
    $(".now-playing .duration .current-time").text(
      queue.formattedCurrentTime ? queue.formattedCurrentTime : ""
    );
    $(".now-playing .duration .song-time").text(
      queue.formattedCurrentTime ? queue.songs[0].formattedDuration : ""
    );

    if (queue.songs.length > 1) {
      $(".now-playing .next-song").addClass("active");
      $(".now-playing .next-song a")
        .attr("href", queue.songs[1].url)
        .text(queue.songs[1].name);
    } else {
      $(".now-playing .next-song").removeClass("active");
    }
  });
});
