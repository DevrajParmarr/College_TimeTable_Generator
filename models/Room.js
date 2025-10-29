const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 200
  },
  building: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for id to match frontend expectations
roomSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
roomSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Room', roomSchema);