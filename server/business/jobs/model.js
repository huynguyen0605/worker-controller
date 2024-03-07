const mongoose = require('mongoose');

/**
 * status
 * iddle
 * processing
 * done
 */

/**
 * domain
 * facebook
 * quora
 */
const JobSchema = new mongoose.Schema(
  {
    name: { type: String },
    code: { type: String },
    domain: { type: String },
    status: { type: String },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags',
      },
    ],
    client_id: { type: String },
    client_name: { type: String },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model('jobs', JobSchema);

module.exports = Job;
