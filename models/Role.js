const mongoose = require('mongoose');
const snowflake = require('@theinternetfolks/snowflake');

const roleSchema = new mongoose.Schema({
  id: {
    type: String,
    default: snowflake.generate,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 64,
  },
  scopes: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Role', roleSchema);