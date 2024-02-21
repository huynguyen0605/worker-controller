const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    name: { type: String },
    color: { type: String },
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.model('tags', TagSchema);

module.exports = Tag;
