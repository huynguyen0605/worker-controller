const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema(
  {
    name: { type: String },
    content: { type: String },
    params: { type: String },
  },
  {
    timestamps: true,
  },
);

const Interaction = mongoose.model('interactions', InteractionSchema);

module.exports = Interaction;
