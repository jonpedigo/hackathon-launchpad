const mongoose = require("mongoose")
const Schema = mongoose.Schema

const GameItemSchema = new Schema({
  name: { type: String, required: true, unique: true }
})

const GameSchema = new Schema({
  itemList: { type: Array, default: [GameItemSchema] },
  logs: { type: Array },
}, {
  usePushEach: true
})

const GameState = mongoose.model("GameState", GameSchema)

module.exports = GameState
