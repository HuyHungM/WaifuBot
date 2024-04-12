const axios = require("axios");

class WaifuAI {
  constructor({ baseURL, apiKey }) {
    this.baseURL = baseURL + "/v1/chat/completions";
    this.apiKey = apiKey;
  }

  async create({ messages, model, max_tokens }) {
    try {
      const res = await axios.post(
        this.baseURL,
        { messages, model, max_tokens },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = { WaifuAI };
