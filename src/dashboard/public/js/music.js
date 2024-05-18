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

$(document).ready(function () {
  setInterval(function () {
    socket.emit("getMusicData", { guildId, userId });
  }, 1000);

  socket.on(`getMusicData-${userId}`, function (queue) {
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

      const translateX = parseFloat(
        ((queue.currentTime / queue.songs[0].duration) * 100).toFixed(3)
      );
      $(".now-playing .duration .time-line").text();
      if ($(".now-playing .duration .time-line .btn").length > 0) {
        $(".now-playing .duration .time-line .btn").css(
          "--translateX",
          `${translateX}%`
        );
      } else {
        $(document.createElement("i"))
          .addClass("btn fa-solid fa-record-vinyl")
          .css("--translateX", `${translateX}%`)
          .appendTo($(".now-playing .duration .time-line"));
      }

      $(".now-playing .duration .time-line").addClass("active");
    } else {
      if ($(".now-playing .background-cover"))
        $(".now-playing .background-cover").remove();

      $(".now-playing .duration .time-line .btn").remove();
      $(".now-playing .duration .time-line").text(
        "Hiện tại không có gì đang phát, thêm trên discord chứ?"
      );
    }

    $(".now-playing .current-song a")
      .attr("href", `${queue.songs.length > 0 ? queue.songs[0].url : "#"}`)
      .attr("target", `${queue.songs.length > 0 ? "_blank" : "_self"}`)
      .text(
        queue.songs.length > 0 ? queue.songs[0].name : "Hiện đang trống..."
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
