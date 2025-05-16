const mongoose = require('mongoose');
const snowflake = require('@theinternetfolks/snowflake');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: snowflake.generate,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [64, 'Name cannot be more than 64 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]*$/.test(v);
      },
      message: 'Name can only contain letters and spaces'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    maxlength: [128, 'Email cannot be more than 128 characters'],
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
    validate: {
      validator: function(v) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v);
      },
      message: 'Password must contain at least one letter and one number'
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ id: 1 });

// Update timestamps on save
userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);