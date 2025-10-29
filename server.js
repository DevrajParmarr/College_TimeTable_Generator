const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { allocateRooms } = require('./utils/roomAllocationEngine');
const { allocateTeacherDuties } = require('./utils/teacherAllocationEngine');

// Import models
const Branch = require('./models/Branch');
const Room = require('./models/Room');
const Exam = require('./models/Exam');
const Teacher = require('./models/Teacher');
const TeacherLeave = require('./models/TeacherLeave');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/branches', async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/exams', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD for branches
app.post('/api/branches', async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.status(201).json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/branches/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD for rooms
app.post('/api/rooms', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD for exams
app.post('/api/exams', async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD for teachers
app.post('/api/teachers', async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/allocate', async (req, res) => {
  try {
    // Fetch data from MongoDB
    const [rooms, exams, teachers] = await Promise.all([
      Room.find(),
      Exam.find(),
      Teacher.find()
    ]);

    // Reset teacher assignments before new allocation
    teachers.forEach(t => {
      t.assignedDuties = [];
    });

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
      id: t._id.toString(),
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