const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    name: { type: String },
    info: { type: String },
    client_assigned_to: { type: String },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags',
      },
    ],
    links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'links',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Account = mongoose.model('accounts', AccountSchema);

module.exports = Account;
