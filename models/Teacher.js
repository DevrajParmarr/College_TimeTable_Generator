const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  experience: {
    type: String,
    required: true,
    enum: ['new', 'experienced']
  },
  weeklyAvailability: {
    monday: {
      type: String,
      enum: ['morning', 'afternoon', 'both'],
      default: 'both'
    },
    tuesday: {
      type: String,
      enum: ['morning', 'afternoon', 'both'],
      default: 'both'
    },
    wednesday: {
      type: String,
      enum: ['morning', 'afternoon', 'both'],
      default: 'both'
    },
    thursday: {
      type: String,
      enum: ['morning', 'afternoon', 'both'],
      default: 'both'
    },
    friday: {
      type: String,
      enum: ['morning', 'afternoon', 'both'],
      default: 'both'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);