const mongoose = require('mongoose');
const snowflake = require('@theinternetfolks/snowflake');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: snowflake.generate,
    unique: true,
  },
  name: {
    type: String,
    maxlength: 64,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 128,
  },
  password: {
    type: String,
    required: true,
    maxlength: 64,
    select: false,
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

module.exports = mongoose.model('User', userSchema);