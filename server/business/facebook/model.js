const mongoose = require('mongoose');

/**
 * status
 * iddle
 * replied
 */

/**
 * type: post/reply
 */
const FacebookSchema = new mongoose.Schema(
  {
    keyword: { type: String },
    title: { type: String },
    url: { type: String },
    type: { type: String },
    status: { type: String },
    reply: { type: String },
    number_of_upvote: { type: String },
    number_of_comment: { type: String },
  },
  {
    timestamps: true,
  },
);

const Facebook = mongoose.model('facebooks', FacebookSchema);

module.exports = Facebook;
