const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Branch = require('./models/Branch');
const Room = require('./models/Room');
const Exam = require('./models/Exam');
const Teacher = require('./models/Teacher');
const TeacherLeave = require('./models/TeacherLeave');

// Import existing data
const branches = require('./data/branches');
const rooms = require('./data/rooms');
const exams = require('./data/exams');
const teachers = require('./data/teachers');
const teacherLeaves = require('./data/teacherLeaves');

async function migrateData() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      Branch.deleteMany({}),
      Room.deleteMany({}),
      Exam.deleteMany({}),
      Teacher.deleteMany({}),
      TeacherLeave.deleteMany({})
    ]);

    console.log('Migrating branches...');
    const migratedBranches = await Branch.insertMany(branches);
    console.log(`Migrated ${migratedBranches.length} branches`);

    console.log('Migrating rooms...');
    const migratedRooms = await Room.insertMany(rooms);
    console.log(`Migrated ${migratedRooms.length} rooms`);

    console.log('Migrating exams...');
    const migratedExams = await Exam.insertMany(exams);
    console.log(`Migrated ${migratedExams.length} exams`);

    console.log('Migrating teachers...');
    try {
      const migratedTeachers = await Teacher.insertMany(teachers, { ordered: false });
      console.log(`Migrated ${migratedTeachers.length} teachers`);
    } catch (error) {
      if (error.code === 11000) {
        console.log('Some teachers already exist, skipping duplicates...');
      } else {
        throw error;
      }
    }

    console.log('Migrating teacher leaves...');
    // Transform teacherLeaves data to match schema
    const transformedLeaves = [];
    for (const leave of teacherLeaves) {
      // Find teacher by name to get ObjectId
      const teacher = await Teacher.findOne({ name: leave.name });
      if (teacher) {
        for (const leaveRecord of leave.leaves) {
          transformedLeaves.push({
            teacherId: teacher._id,
            leaveDates: [new Date(leaveRecord.date)],
            reason: leaveRecord.reason
          });
        }
      }
    }

    if (transformedLeaves.length > 0) {
      const migratedLeaves = await TeacherLeave.insertMany(transformedLeaves);
      console.log(`Migrated ${migratedLeaves.length} teacher leave records`);
    } else {
      console.log('No teacher leaves to migrate');
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();