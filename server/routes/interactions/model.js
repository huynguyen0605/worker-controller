const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema(
  {
    name: { type: String },
    content: { type: String },
    params: { type: String },
    sort: { type: String },
  },
  {
    timestamps: true,
  },
);

InteractionSchema.index({ sort: 1 });
const Interaction = mongoose.model('interactions', InteractionSchema);

module.exports = Interaction;
