const branches = require("./data/branches");
const rooms = require("./data/rooms");
const exams = require("./data/exams");
const teachers = require("./data/teachers");

const { allocateRooms } = require("./utils/roomAllocationEngine");
const { allocateTeacherDuties } = require("./utils/teacherAllocationEngine");

console.log("🧮 Running Room Allocation Engine...\n");

// Step 1: Allocate rooms
const roomAllocationResult = allocateRooms(rooms, exams);
const roomPlan = roomAllocationResult.results || roomAllocationResult;

// Display room allocations
console.log("📌 Room Allocation Plan:\n");
console.table(
  roomPlan.map(r => ({
    Date: r.date,
    Shift: r.shift,
    Room: r.room,
    Capacity: r.capacity,
    Allocations: r.allocations.map(a => `${a.dept}(${a.students})`).join(", "),
    Total_Students: r.totalStudents,
    Teachers_Required: r.teachersRequired,
  }))
);

// Step 2: Calculate average duty per teacher
const totalTeachersRequired = roomPlan.reduce((sum, r) => sum + r.teachersRequired, 0);
const totalAvailableTeachers = teachers.length;
const rawAvg = totalTeachersRequired / totalAvailableTeachers;
const avgDuty = Math.ceil(rawAvg); // max per teacher for fair distribution

console.log("\n📊 Summary:");
console.log("Total Teachers Required:", totalTeachersRequired);
console.log("Total Available Teachers:", totalAvailableTeachers);
console.log("Average Duty per Teacher:", avgDuty);

// Step 3: Allocate teachers based on room allocation and avgDuty
const dutyAssignments = allocateTeacherDuties(teachers, roomPlan, avgDuty);

// Step 4: Display teacher assignments
console.log("\n🧑‍🏫 Teacher Duty Assignments:\n");
console.table(
  dutyAssignments.map(d => ({
    Date: d.date,
    Shift: d.shift,
    Room: d.room,
    Teachers: d.teachers.join(", "),
  }))
);

// Step 5: Teacher duty load and distribution report
console.log("\n📝 Teacher Duty Load:");
teachers.forEach(t => {
  const dutyCount = t.assignedDuties?.length || 0;
  console.log(`ID: ${t.id}, Name: ${t.name}, Duties Assigned: ${dutyCount}`);
});

// Step 6: Highlight teachers below/above average
const belowAvg = teachers.filter(t => (t.assignedDuties?.length || 0) < avgDuty);
const aboveAvg = teachers.filter(t => (t.assignedDuties?.length || 0) > avgDuty);

console.log("\n⚖️ Duty Distribution Report:");
console.log(`Teachers below average (${avgDuty}):`);
belowAvg.forEach(t => console.log(`ID: ${t.id}, Name: ${t.name}, Duties: ${t.assignedDuties?.length || 0}`));

console.log(`\nTeachers above average (${avgDuty}):`);
aboveAvg.forEach(t => console.log(`ID: ${t.id}, Name: ${t.name}, Duties: ${t.assignedDuties?.length || 0}`));
