const messageState = require("../models/messageState");

const createMessageState = async ({ ownerID }) => {
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
};

const findMessageState = async ({ ownerID }) => {
  const filter = { ownerID: ownerID };

  const messageStateData = await messageState.findOne(filter);

  if (messageStateData) {
    return messageStateData;
  } else {
    return null;
  }
};

const updateMessageState = async ({ state, ownerID }) => {
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
};

const deleteMessageState = async ({ ownerID }) => {
  const filter = { ownerID: ownerID };

  const messageStateData = await messageState.deleteOne(filter);

  if (messageStateData.deletedCount == 1) {
    return messageStateData.deletedCount;
  } else return null;
};

module.exports = {
  createMessageState,
  findMessageState,
  updateMessageState,
  deleteMessageState,
};
