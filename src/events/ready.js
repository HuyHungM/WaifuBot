const { ActivityType, REST, Routes } = require("discord.js");

module.exports = (client) => {
  client.once("ready", async () => {
    console.log(`🟢 [LIVE]: BOT đã đăng nhập với tên ${client.user.tag}!`);

    client.user.setPresence({
      activities: [
        {
          name: "Đang làm người yêu bạn | w!help",
          type: ActivityType.Custom,
        },
      ],
      status: "idle",
    });

    const interactionData = client.interactions.map((interaction) => ({
      name: interaction.name,
      description: interaction.description,
      type: interaction.type,
      options: interaction.options || [],
    }));

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: interactionData,
      });
    } catch (error) {
      console.log(error);
    }
  });
};
