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
          `🟢 [COMMAND BUTTON]: Đã tải command button ${interactionButton.name}`
        );
      } else {
        console.log(
          `🟠 [WARN - SLASH COMMAND]: Không thể tải command button ${
            file.split(".")[0]
          } - thiếu interactionButton.name`
        );
      }
    });
};
