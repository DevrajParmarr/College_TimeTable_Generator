const mongoose = require('mongoose');

const teacherLeaveSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  leaveDates: [{
    type: Date,
    required: true
  }],
  reason: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
teacherLeaveSchema.index({ teacherId: 1, 'leaveDates': 1 });

module.exports = mongoose.model('TeacherLeave', teacherLeaveSchema);