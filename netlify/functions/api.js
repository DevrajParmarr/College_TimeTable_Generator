const { allocateRooms } = require('../../utils/roomAllocationEngine');
const { allocateTeacherDuties } = require('../../utils/teacherAllocationEngine');
let branches = require('../../data/branches');
let rooms = require('../../data/rooms');
let exams = require('../../data/exams');
let teachers = require('../../data/teachers');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : null;
    const pathParts = path.split('/').filter(p => p);

    // Health check
    if (path === '/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() })
      };
    }

    // Branches endpoints
    if (path === '/branches') {
      if (method === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(branches)
        };
      } else if (method === 'POST') {
        const newBranch = body;
        const maxId = branches.length > 0 ? Math.max(...branches.map(b => parseInt(b.id))) : 0;
        newBranch.id = (maxId + 1).toString();
        branches.push(newBranch);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newBranch)
        };
      }
    }

    // Branches by ID
    if (pathParts[0] === 'branches' && pathParts.length === 2) {
      const id = pathParts[1];
      const index = branches.findIndex(b => b.id === id);

      if (method === 'PUT') {
        if (index === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Branch not found' })
          };
        }
        branches[index] = { ...branches[index], ...body };
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(branches[index])
        };
      } else if (method === 'DELETE') {
        if (index === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Branch not found' })
          };
        }
        branches.splice(index, 1);
        return {
          statusCode: 204,
          headers,
          body: ''
        };
      }
    }

    // Rooms endpoints
    if (path === '/rooms') {
      if (method === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(rooms)
        };
      } else if (method === 'POST') {
        const newRoom = body;
        const maxId = rooms.length > 0 ? Math.max(...rooms.map(r => parseInt(r.id))) : 0;
        newRoom.id = (maxId + 1).toString();
        rooms.push(newRoom);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newRoom)
        };
      }
    }

    // Rooms by ID
    if (pathParts[0] === 'rooms' && pathParts.length === 2) {
      const id = pathParts[1];
      const index = rooms.findIndex(r => r.id === id);

      if (method === 'PUT') {
        if (index === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Room not found' })
          };
        }
        rooms[index] = { ...rooms[index], ...body };
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(rooms[index])
        };
      } else if (method === 'DELETE') {
        if (index === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Room not found' })
          };
        }
        rooms.splice(index, 1);
        return {
          statusCode: 204,
          headers,
          body: ''
        };
      }
    }

    // Exams endpoints
    if (path === '/exams') {
      if (method === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(exams)
        };
      } else if (method === 'POST') {
        const newExam = body;
        const maxId = exams.length > 0 ? Math.max(...exams.map(e => parseInt(e.id))) : 0;
        newExam.id = (maxId + 1).toString();
        exams.push(newExam);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newExam)
        };
      }
    }

    // Exams by ID
    if (pathParts[0] === 'exams' && pathParts.length === 2) {
      const id = pathParts[1];
      const index = exams.findIndex(e => e.id === id);

      if (method === 'PUT') {
        if (index === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Exam not found' })
          };
        }
        exams[index] = { ...exams[index], ...body };
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(exams[index])
        };
      } else if (method === 'DELETE') {
        if (index === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Exam not found' })
          };
        }
        exams.splice(index, 1);
        return {
          statusCode: 204,
          headers,
          body: ''
        };
      }
    }

    // Teachers endpoints
    if (path === '/teachers') {
      if (method === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(teachers)
        };
      } else if (method === 'POST') {
        const newTeacher = body;
        const maxId = teachers.length > 0 ? Math.max(...teachers.map(t => parseInt(t.id))) : 0;
        newTeacher.id = (maxId + 1).toString();
        teachers.push(newTeacher);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newTeacher)
        };
      }
    }

    // Teachers by ID
    if (pathParts[0] === 'teachers' && pathParts.length === 2) {
      const id = pathParts[1];
      const index = teachers.findIndex(t => t.id === id);

      if (method === 'PUT') {
        if (index === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Teacher not found' })
          };
        }
        teachers[index] = { ...teachers[index], ...body };
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(teachers[index])
        };
      } else if (method === 'DELETE') {
        if (index === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Teacher not found' })
          };
        }
        teachers.splice(index, 1);
        return {
          statusCode: 204,
          headers,
          body: ''
        };
      }
    }

    // Allocation endpoint
    if (path === '/allocate' && method === 'POST') {
      try {
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

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
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
          })
        };
      } catch (error) {
        console.error('Allocation error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Failed to perform allocation',
            message: error.message
          })
        };
      }
    }

    // Route not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};