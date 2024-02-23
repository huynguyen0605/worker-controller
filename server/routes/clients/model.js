const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String },
    available: { type: Boolean, default: true },
    process: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'processes',
      unique: true, // Ensures that each client has at most one associated process
    },
    sort: { type: String },
  },
  {
    timestamps: true,
  },
);

ClientSchema.index({ name: 1 });
ClientSchema.index({ sort: 1 });
const Client = mongoose.model('clients', ClientSchema);

module.exports = Client;
