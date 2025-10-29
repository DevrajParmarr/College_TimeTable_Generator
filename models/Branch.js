const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for id to match frontend expectations
branchSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
branchSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Branch', branchSchema);