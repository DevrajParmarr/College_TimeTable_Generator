const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  eligibleStudents: {
    type: Number,
    required: true,
    min: 1
  },
  shift: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon']
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  subjects: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Virtual for id to match frontend expectations
examSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
examSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Exam', examSchema);