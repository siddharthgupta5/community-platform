const mongoose = require('mongoose');
const snowflake = require('@theinternetfolks/snowflake');

const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    default: snowflake.generate,
    unique: true,
  },
  community: {
    type: String,
    ref: 'Community',
    required: true,
  },
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    ref: 'Role',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Add compound index to ensure unique user per community
memberSchema.index({ community: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Member', memberSchema);