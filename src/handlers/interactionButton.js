const { readdirSync } = require("fs");

module.exports = (client) => {
  readdirSync(`./src/interactionButtons/`)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      let interactionButton = require(`../interactionButtons/${file}`);

      if (interactionButton.name) {
        client.interactionButtons.set(
          interactionButton.name,
          interactionButton
        );
        console.log(
          `🟢 [BUTTON COMMAND]: Đã tải button command ${interactionButton.name}`
        );
      } else {
        console.log(
          `🟠 [WARN - BUTTON COMMAND]: Không thể tải button command ${
            file.split(".")[0]
          } - thiếu interactionButton.name`
        );
      }
    });
};
