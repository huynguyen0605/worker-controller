const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema(
  {
    title: { type: String },
    url: { type: String },
    type: { type: String },
  },
  {
    timestamps: true,
  },
);

const Link = mongoose.model('links', LinkSchema);

module.exports = Link;
