const axios = require("axios");
const waifu = require("./waifu");
const messageState = require("./messageState");
const OpenAI = require("openai");

class WaifuAI {
  constructor({ baseURL, apiKey }) {
    this.baseURL = baseURL + "/v1/chat/completions";
    this.apiKey = apiKey;

    const openai = new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.BASE_AI_URL,
    });

    this.openai = openai;
  }

  async create({ name, ownerID, messages }) {
    const newWaifu = waifu({
      name: name,
      ownerID: ownerID,
      messages: messages,
    });

    try {
      await newWaifu.save();
      return newWaifu;
    } catch (error) {
      return null;
    }
  }

  async delete({ ownerID }) {
    const filter = { ownerID: ownerID };

    const waifuData = await waifu.deleteOne(filter);

    if (waifuData.deletedCount == 1) {
      return waifuData.deletedCount;
    } else return null;
  }

  async find({ ownerID }) {
    const filter = { ownerID: ownerID };

    const waifuData = await waifu.findOne(filter);

    if (waifuData) {
      return waifuData;
    } else {
      return null;
    }
  }

  async createMessage({ messages, model }) {
    try {
      const res = await this.openai.chat.completions.create({
        messages: messages,
        model: model,
      });

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateMessage({ ownerID, messages }) {
    const filter = { ownerID: ownerID };

    const options = {
      upsert: true,
      new: true,
    };

    try {
      const waifuData = await waifu.findOneAndUpdate(
        filter,
        {
          messages: messages,
        },
        options
      );

      return waifuData;
    } catch (error) {
      return null;
    }
  }

  async createMessageState({ ownerID }) {
    const newMessageState = messageState({
      isReplied: true,
      ownerID: ownerID,
    });

    try {
      newMessageState.save();
      return newMessageState;
    } catch (error) {
      return null;
    }
  }

  async findMessageState({ ownerID }) {
    const filter = { ownerID: ownerID };

    const messageStateData = await messageState.findOne(filter);

    if (messageStateData) {
      return messageStateData;
    } else {
      return null;
    }
  }

  async updateMessageState({ state, ownerID }) {
    const filter = { ownerID: ownerID };

    const options = {
      upsert: true,
      new: true,
    };

    try {
      const messageStateData = messageState.findOneAndUpdate(
        filter,
        {
          isReplied: state,
        },
        options
      );
      return messageStateData;
    } catch (error) {
      return null;
    }
  }

  async deleteMessageState({ ownerID }) {
    const filter = { ownerID: ownerID };

    const messageStateData = await messageState.deleteOne(filter);

    if (messageStateData.deletedCount == 1) {
      return messageStateData.deletedCount;
    } else return null;
  }
}

module.exports = { WaifuAI };
