const mongoose = require('mongoose');

const ProcessesSchema = new mongoose.Schema(
  {
    name: { type: String },
    interactions: { type: String },
  },
  {
    timestamps: true,
  },
);

const Processes = mongoose.model('processes', ProcessesSchema);

module.exports = Processes;
