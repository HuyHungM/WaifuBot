const { readdirSync } = require("fs");

module.exports = (client) => {
  readdirSync("./src/interactions/").forEach((dir) => {
    const interactions = readdirSync(`./src/interactions/${dir}/`).filter(
      (file) => file.endsWith(".js")
    );

    for (let file of interactions) {
      let interaction = require(`../interactions/${dir}/${file}`);

      if (interaction.name) {
        client.interactions.set(interaction.name, interaction);
        console.log(
          `🟢 [SLASH COMMAND]: Đã tải slash command ${interaction.name}`
        );
      } else {
        console.log(
          `🟠 [WARN - SLASH COMMAND]: Không thể tải slash command ${
            file.split(".")[0]
          } - thiếu interaction.name`
        );
        continue;
      }
    }
  });
};
