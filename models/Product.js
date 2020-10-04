const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  color: {
    type: String,
  },
  season: {
    type: String,
  },
  location: {
    type: String,
  },
  sizes: {
    type: String,
  },
  date: {
    type: Date,
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Product = mongoose.model("product", ProductSchema);
