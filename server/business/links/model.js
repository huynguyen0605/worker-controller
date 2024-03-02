const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema(
  {
    url: { type: String },
  },
  {
    timestamps: true,
  },
);

const Link = mongoose.model('links', LinkSchema);

module.exports = Link;
