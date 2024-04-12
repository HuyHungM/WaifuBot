require("dotenv").config();
const { WaifuAI } = require("../model/WaifuAI");

module.exports = (client) => {
  const waifuai = new WaifuAI({
    apiKey: process.env.AI_API,
    baseURL: process.env.BASE_AI_URL,
  });

  client.waifuai = waifuai;
};
