const mongoose = require('mongoose');

/**
 * status
 * iddle
 * replied
 */
const QuoraSchema = new mongoose.Schema(
  {
    keyword: { type: String },
    title: { type: String },
    url: { type: String },
    status: { type: String },
    reply: { type: String },
    number_of_upvote: { type: String },
    number_of_comment: { type: String },
    client_id: { type: String },
    client_name: { type: String },
  },
  {
    timestamps: true,
  },
);

const Quora = mongoose.model('quoras', QuoraSchema);

module.exports = Quora;
