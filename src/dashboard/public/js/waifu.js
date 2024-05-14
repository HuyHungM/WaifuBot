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
});
