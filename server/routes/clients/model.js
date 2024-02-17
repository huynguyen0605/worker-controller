const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

ClientSchema.index({ name: 1 });
const Client = mongoose.model('clients', ClientSchema);

module.exports = Client;
