const mongoose = require('mongoose');

/**
 * status
 * iddle
 * replied
 */

/**
 * type: post/comment/group-post/group-comment
 */
const FacebookSchema = new mongoose.Schema(
  {
    keyword: { type: String },
    title: { type: String },
    url: { type: String },
    type: { type: String },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags',
      },
    ],
    status: { type: String },
    reply: { type: String },
    number_of_upvote: { type: String },
    number_of_comment: { type: String },
    visible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Facebook = mongoose.model('facebooks', FacebookSchema);

module.exports = Facebook;
