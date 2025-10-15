function allocateRooms(rooms, exams, totalAvailableTeachers) {
  const grouped = {};

  exams.forEach(exam => {
    const key = `${exam.date}_${exam.shift}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ ...exam });
  });

  const results = [];

  Object.keys(grouped).forEach(slot => {
    const [date, shift] = slot.split("_");
    const pending = grouped[slot].map(e => ({
      department: e.department,
      students: e.eligibleStudents,
    }));

    const slotAllocations = [];
    const availableRooms = [...rooms].sort((a, b) => b.capacity - a.capacity);

    for (const room of availableRooms) {
      let roomCapacity = room.capacity;
      const allocations = [];

      while (pending.length && roomCapacity > 0) {
        pending.sort((a, b) => b.students - a.students);
        const exam = pending[0];
        if (!exam) break;

        // Max 50% per branch
        const maxPerBranch = Math.ceil(room.capacity / 2);
        const alloc = Math.min(exam.students, roomCapacity, maxPerBranch);
        allocations.push({ dept: exam.department, students: alloc });
        exam.students -= alloc;
        roomCapacity -= alloc;

        if (exam.students === 0) pending.shift();
      }

      const totalStudents = allocations.reduce((s, a) => s + a.students, 0);
      if (totalStudents === 0) continue;

      let teachersRequired = 1;
      if (totalStudents > 60) teachersRequired = 4;
      else if (totalStudents > 40) teachersRequired = 3;
      else if (totalStudents >= 20) teachersRequired = 2;

      slotAllocations.push({
        date,
        shift,
        room: room.name,
        capacity: room.capacity,
        allocations,
        totalStudents,
        teachersRequired,
      });
    }

    results.push(...slotAllocations);
  });

  return { results };
}

module.exports = { allocateRooms };
