const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    name: { type: String },
    info: { type: String },
    client_assigned_to: { type: String },
    tag: { type: [String], default: [] }, // danh sách chủ đề gắn với tài khoản
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
