const mongoose = require('mongoose');
const snowflake = require('@theinternetfolks/snowflake');
const slugify = require('slugify');

const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    default: snowflake.generate,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 128,
  },
  slug: {
    type: String,
    unique: true,
    maxlength: 255,
  },
  owner: {
    type: String,
    ref: 'User',
    required: true,
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

communitySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Community', communitySchema);