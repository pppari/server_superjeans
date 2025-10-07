const mongoose = require("mongoose")

const toObjectId = (id) => {
  const ObjectId = new mongoose.Types.ObjectId(id)
  return ObjectId
}

module.exports = toObjectId;