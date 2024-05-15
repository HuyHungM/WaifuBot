const socket = io();

$(document).ready(function () {
  const scrollMessageList = setInterval(async function () {
    const messageList = $(".message-list");
    if (messageList.length > 0) {
      await messageList.animate(
        {
          scrollTop: messageList[0].scrollHeight,
        },
        1000,
        function () {
          clearInterval(scrollMessageList);
        }
      );
    }
  }, 1000);

  socket.on(`sendWaifuMessage-${userId}`, function (res) {
    const waifuMessageContainer = $(document.createElement("div")).addClass(
      "message-container waifu"
    );
    $("#dashboard .message-list").append(waifuMessageContainer);
    const waifuMessageContent = $(document.createElement("div"))
      .addClass("message")
      .text(res.choices[0].message.content);
    $(waifuMessageContainer).append(waifuMessageContent);
    $(".message-list").animate({
      scrollTop: $(".message-list")[0].scrollHeight,
    });
  });

  $("#message-form").on("submit", function (e) {
    e.preventDefault();
    const message = $("#message-input").val();
    socket.emit(`sendWaifuMessage`, { userId, message });
    $("#message-input").val("");

    const userMessageContainer = $(document.createElement("div")).addClass(
      "message-container user"
    );
    $("#dashboard .message-list").append(userMessageContainer);
    const userMessageContent = $(document.createElement("div"))
      .addClass("message")
      .text(message);
    $(userMessageContainer).append(userMessageContent);
    $(".message-list").animate({
      scrollTop: $(".message-list")[0].scrollHeight,
    });
  });
});
