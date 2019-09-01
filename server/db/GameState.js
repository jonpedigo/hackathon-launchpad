const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  itemList: { type: Array, default: [] },
});

const GameState = mongoose.model("GameState", GameSchema);

module.exports = GameState;
