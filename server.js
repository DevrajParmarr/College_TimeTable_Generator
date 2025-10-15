const express = require('express');
const cors = require('cors');
const { allocateRooms } = require('./utils/roomAllocationEngine');
const { allocateTeacherDuties } = require('./utils/teacherAllocationEngine');
let branches = require('./data/branches');
let rooms = require('./data/rooms');
let exams = require('./data/exams');
let teachers = require('./data/teachers');

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

// CRUD for branches
app.post('/api/branches', (req, res) => {
  const newBranch = req.body;
  const maxId = branches.length > 0 ? Math.max(...branches.map(b => parseInt(b.id))) : 0;
  newBranch.id = (maxId + 1).toString();
  branches.push(newBranch);
  res.status(201).json(newBranch);
});

app.put('/api/branches/:id', (req, res) => {
  const { id } = req.params;
  const index = branches.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Branch not found' });
  branches[index] = { ...branches[index], ...req.body };
  res.json(branches[index]);
});

app.delete('/api/branches/:id', (req, res) => {
  const { id } = req.params;
  const index = branches.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Branch not found' });
  branches.splice(index, 1);
  res.status(204).send();
});

// CRUD for rooms
app.post('/api/rooms', (req, res) => {
  const newRoom = req.body;
  const maxId = rooms.length > 0 ? Math.max(...rooms.map(r => parseInt(r.id))) : 0;
  newRoom.id = (maxId + 1).toString();
  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

app.put('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const index = rooms.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Room not found' });
  rooms[index] = { ...rooms[index], ...req.body };
  res.json(rooms[index]);
});

app.delete('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const index = rooms.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Room not found' });
  rooms.splice(index, 1);
  res.status(204).send();
});

// CRUD for exams
app.post('/api/exams', (req, res) => {
  const newExam = req.body;
  const maxId = exams.length > 0 ? Math.max(...exams.map(e => parseInt(e.id))) : 0;
  newExam.id = (maxId + 1).toString();
  exams.push(newExam);
  res.status(201).json(newExam);
});

app.put('/api/exams/:id', (req, res) => {
  const { id } = req.params;
  const index = exams.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: 'Exam not found' });
  exams[index] = { ...exams[index], ...req.body };
  res.json(exams[index]);
});

app.delete('/api/exams/:id', (req, res) => {
  const { id } = req.params;
  const index = exams.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: 'Exam not found' });
  exams.splice(index, 1);
  res.status(204).send();
});

// CRUD for teachers
app.post('/api/teachers', (req, res) => {
  const newTeacher = req.body;
  const maxId = teachers.length > 0 ? Math.max(...teachers.map(t => parseInt(t.id))) : 0;
  newTeacher.id = (maxId + 1).toString();
  teachers.push(newTeacher);
  res.status(201).json(newTeacher);
});

app.put('/api/teachers/:id', (req, res) => {
  const { id } = req.params;
  const index = teachers.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Teacher not found' });
  teachers[index] = { ...teachers[index], ...req.body };
  res.json(teachers[index]);
});

app.delete('/api/teachers/:id', (req, res) => {
  const { id } = req.params;
  const index = teachers.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Teacher not found' });
  teachers.splice(index, 1);
  res.status(204).send();
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