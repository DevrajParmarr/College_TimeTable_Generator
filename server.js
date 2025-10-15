const express = require('express');
const cors = require('cors');
const { allocateRooms } = require('./utils/roomAllocationEngine');
const { allocateTeacherDuties } = require('./utils/teacherAllocationEngine');
const branches = require('./data/branches');
const rooms = require('./data/rooms');
const exams = require('./data/exams');
const teachers = require('./data/teachers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/branches', (req, res) => {
  res.json(branches);
});

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/api/exams', (req, res) => {
  res.json(exams);
});

app.get('/api/teachers', (req, res) => {
  res.json(teachers);
});

app.post('/api/allocate', (req, res) => {
  try {
    // Step 1: Allocate rooms
    const roomAllocationResult = allocateRooms(rooms, exams);
    const roomPlan = roomAllocationResult.results || roomAllocationResult;

    // Step 2: Calculate average duty per teacher
    const totalTeachersRequired = roomPlan.reduce((sum, r) => sum + r.teachersRequired, 0);
    const totalAvailableTeachers = teachers.length;
    const rawAvg = totalTeachersRequired / totalAvailableTeachers;
    const avgDuty = Math.ceil(rawAvg);

    // Step 3: Allocate teachers
    const dutyAssignments = allocateTeacherDuties(teachers, roomPlan, avgDuty);

    // Step 4: Calculate teacher duty load
    const teacherDutyLoad = teachers.map(t => ({
      id: t.id,
      name: t.name,
      dutiesAssigned: t.assignedDuties?.length || 0,
      experience: t.experience
    }));

    // Step 5: Generate summary
    const summary = {
      totalTeachersRequired,
      totalAvailableTeachers,
      averageDutyPerTeacher: avgDuty,
      totalRoomsAllocated: roomPlan.length,
      totalExams: exams.length
    };

    // Step 6: Duty distribution analysis
    const belowAvg = teacherDutyLoad.filter(t => t.dutiesAssigned < avgDuty);
    const aboveAvg = teacherDutyLoad.filter(t => t.dutiesAssigned > avgDuty);

    res.json({
      success: true,
      data: {
        roomAllocations: roomPlan,
        teacherAssignments: dutyAssignments,
        teacherDutyLoad,
        summary,
        distribution: {
          belowAverage: belowAvg,
          aboveAverage: aboveAvg
        }
      }
    });
  } catch (error) {
    console.error('Allocation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform allocation',
      message: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

module.exports = app;