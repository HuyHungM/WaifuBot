const waifu = require("../models/waifu");

const createWaifu = async ({ name, ownerID, model, messages }) => {
  const newWaifu = waifu({
    name: name,
    ownerID: ownerID,
    model: model,
    messages: messages,
  });

  try {
    await newWaifu.save();
    return { status: 200, message: "Đã khởi tạo waifu thành công" };
  } catch (error) {
    return { status: 404, message: "Đã xảy ra lỗi" };
  }
};

const deleteWaifu = async ({ ownerID }) => {
  const filter = { ownerID: ownerID };

  const waifuData = await waifu.deleteOne(filter);

  if (waifuData.deletedCount == 1) {
    return waifuData.deletedCount;
  } else return null;
};

const findWaifu = async ({ ownerID }) => {
  const filter = { ownerID: ownerID };

  const waifuData = await waifu.findOne(filter);

  if (waifuData) {
    return waifuData;
  } else {
    return null;
  }
};

const updateWaifuMessage = async ({ ownerID, messages }) => {
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
};

module.exports = { createWaifu, deleteWaifu, findWaifu, updateWaifuMessage };
