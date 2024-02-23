const mongoose = require('mongoose');

const ProcessesSchema = new mongoose.Schema(
  {
    name: { type: String },
    interactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interactions',
      },
    ],
    is_primary: { type: Boolean },
    sort: { type: String },
  },
  {
    timestamps: true,
  },
);

ProcessesSchema.index({ sort: 1 });
const Processes = mongoose.model('processes', ProcessesSchema);

module.exports = Processes;
