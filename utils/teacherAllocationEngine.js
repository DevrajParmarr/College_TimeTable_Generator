const teacherLeaves = require("../data/teacherLeaves"); // Import leave data

function allocateTeacherDuties(teachers, roomPlan, avgDuty) {
  const dutyAssignments = [];

  // Initialize assignedDuties if not present
  teachers.forEach(t => {
    t.assignedDuties = t.assignedDuties || [];
  });

  roomPlan.forEach(room => {
    const { date, shift, room: roomName, teachersRequired } = room;

    // Filter available teachers for this shift and date
    const availableTeachers = teachers.filter(t => {
      // Already assigned on this date?
      const hasDutyToday = t.assignedDuties.some(d => d.date === date);
      if (hasDutyToday) return false;

      // Check weekly availability
      const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const shiftAvailability = t.weeklyAvailability[dayOfWeek];
      if (!shiftAvailability) return false;
      if (shiftAvailability !== "both" && shiftAvailability !== shift) return false;

      // Check leave
      const leaves = teacherLeaves.find(l => l.id === t.id)?.leaves || [];
      const onLeave = leaves.some(l => l.date === date);
      if (onLeave) return false;

      return true;
    });

    if (availableTeachers.length === 0) {
      // No teacher available for this room
      dutyAssignments.push({
        date,
        shift,
        room: roomName,
        teachers: ["Unassigned"],
      });
      return;
    }

    // Sort teachers by assignedDuties length ascending (least assigned first)
    const sortedTeachers = [...availableTeachers].sort((a, b) => a.assignedDuties.length - b.assignedDuties.length);

    const assigned = [];
    let idx = 0;

    for (let i = 0; i < teachersRequired; i++) {
      if (sortedTeachers.length === 0) break;

      // Assign teacher with least duties
      let t = sortedTeachers[idx % sortedTeachers.length];

      assigned.push(t);
      t.assignedDuties.push({ date, shift, room: roomName });

      idx++;
      // Re-sort to ensure teachers with fewer duties stay at front
      sortedTeachers.sort((a, b) => a.assignedDuties.length - b.assignedDuties.length);
    }

    dutyAssignments.push({
      date,
      shift,
      room: roomName,
      teachers: assigned.map(t => `${t.name} (${t.experience})`),
    });
  });

  return dutyAssignments;
}

module.exports = { allocateTeacherDuties };
