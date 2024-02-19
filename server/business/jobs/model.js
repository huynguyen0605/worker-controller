const mongoose = require('mongoose');

/**
 * status
 * iddle
 * processing
 * done
 */
const JobSchema = new mongoose.Schema(
  {
    name: { type: String },
    code: { type: String },
    status: { type: String },
    client_id: { type: String },
    client_name: { type: String },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model('jobs', JobSchema);

module.exports = Job;
