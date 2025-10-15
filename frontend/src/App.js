import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  School,
  Person,
  Room,
  Assessment,
  ExpandMore,
  Refresh,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import axios from 'axios';
import './App.css';

function App() {
  const [allocationData, setAllocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [allocationSubTab, setAllocationSubTab] = useState(0);
  const [adminTab, setAdminTab] = useState(0);
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [exams, setExams] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchForm, setBranchForm] = useState({ name: '', code: '' });
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: '', capacity: '', building: '' });
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [examForm, setExamForm] = useState({
    name: '',
    department: '',
    subject: '',
    eligibleStudents: '',
    shift: 'morning',
    date: '',
    startTime: '',
    endTime: '',
    subjects: []
  });
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    department: '',
    dateOfJoining: '',
    experience: 'new',
    weeklyAvailability: {
      monday: 'both',
      tuesday: 'both',
      wednesday: 'both',
      thursday: 'both',
      friday: 'both'
    }
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchAllocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/allocate`);
      setAllocationData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch allocation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocation();
    fetchAdminData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAdminData = async () => {
    try {
      const [branchesRes, roomsRes, examsRes, teachersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/branches`),
        axios.get(`${API_BASE_URL}/rooms`),
        axios.get(`${API_BASE_URL}/exams`),
        axios.get(`${API_BASE_URL}/teachers`)
      ]);
      setBranches(branchesRes.data);
      setRooms(roomsRes.data);
      setExams(examsRes.data);
      setTeachers(teachersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleAddBranch = () => {
    setEditingBranch(null);
    setBranchForm({ name: '', code: '' });
    setBranchDialogOpen(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setBranchForm({ name: branch.name, code: branch.code });
    setBranchDialogOpen(true);
  };

  const handleDeleteBranch = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`${API_BASE_URL}/branches/${id}`);
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete branch:', err);
      }
    }
  };

  const handleSaveBranch = async () => {
    try {
      if (editingBranch) {
        await axios.put(`${API_BASE_URL}/branches/${editingBranch.id}`, branchForm);
      } else {
        await axios.post(`${API_BASE_URL}/branches`, branchForm);
      }
      setBranchDialogOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save branch:', err);
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setRoomForm({ name: '', capacity: '', building: '' });
    setRoomDialogOpen(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({ name: room.name, capacity: room.capacity.toString(), building: room.building });
    setRoomDialogOpen(true);
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`${API_BASE_URL}/rooms/${id}`);
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete room:', err);
      }
    }
  };

  const handleSaveRoom = async () => {
    try {
      const formData = { ...roomForm, capacity: parseInt(roomForm.capacity) };
      if (editingRoom) {
        await axios.put(`${API_BASE_URL}/rooms/${editingRoom.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/rooms`, formData);
      }
      setRoomDialogOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save room:', err);
    }
  };

  const handleAddExam = () => {
    setEditingExam(null);
    setExamForm({
      name: '',
      department: '',
      subject: '',
      eligibleStudents: '',
      shift: 'morning',
      date: '',
      startTime: '',
      endTime: '',
      subjects: []
    });
    setExamDialogOpen(true);
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setExamForm({
      name: exam.name,
      department: exam.department,
      subject: exam.subject,
      eligibleStudents: exam.eligibleStudents.toString(),
      shift: exam.shift,
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      subjects: exam.subjects || []
    });
    setExamDialogOpen(true);
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await axios.delete(`${API_BASE_URL}/exams/${id}`);
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete exam:', err);
      }
    }
  };

  const handleSaveExam = async () => {
    try {
      const formData = {
        ...examForm,
        eligibleStudents: parseInt(examForm.eligibleStudents),
        subjects: examForm.subjects.length > 0 ? examForm.subjects : [examForm.subject]
      };
      if (editingExam) {
        await axios.put(`${API_BASE_URL}/exams/${editingExam.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/exams`, formData);
      }
      setExamDialogOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save exam:', err);
    }
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setTeacherForm({
      name: '',
      email: '',
      department: '',
      dateOfJoining: '',
      experience: 'new',
      weeklyAvailability: {
        monday: 'both',
        tuesday: 'both',
        wednesday: 'both',
        thursday: 'both',
        friday: 'both'
      }
    });
    setTeacherDialogOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      dateOfJoining: teacher.dateOfJoining,
      experience: teacher.experience,
      weeklyAvailability: teacher.weeklyAvailability
    });
    setTeacherDialogOpen(true);
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`${API_BASE_URL}/teachers/${id}`);
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete teacher:', err);
      }
    }
  };

  const handleSaveTeacher = async () => {
    try {
      if (editingTeacher) {
        await axios.put(`${API_BASE_URL}/teachers/${editingTeacher.id}`, teacherForm);
      } else {
        await axios.post(`${API_BASE_URL}/teachers`, teacherForm);
      }
      setTeacherDialogOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save teacher:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAdminTabChange = (event, newValue) => {
    setAdminTab(newValue);
  };

  const handleAllocationSubTabChange = (event, newValue) => {
    setAllocationSubTab(newValue);
  };

  const renderSummaryCards = () => {
    if (!allocationData?.summary) return null;

    const { summary } = allocationData;

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School />
                {summary.totalExams}
              </Typography>
              <Typography variant="body2">Total Exams</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Room />
                {summary.totalRoomsAllocated}
              </Typography>
              <Typography variant="body2">Rooms Allocated</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person />
                {summary.totalAvailableTeachers}
              </Typography>
              <Typography variant="body2">Available Teachers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment />
                {summary.averageDutyPerTeacher}
              </Typography>
              <Typography variant="body2">Avg Duty/Teacher</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderRoomAllocations = () => {
    if (!allocationData?.roomAllocations) return null;

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Shift</strong></TableCell>
              <TableCell><strong>Room</strong></TableCell>
              <TableCell><strong>Capacity</strong></TableCell>
              <TableCell><strong>Allocations</strong></TableCell>
              <TableCell><strong>Total Students</strong></TableCell>
              <TableCell><strong>Teachers Required</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocationData.roomAllocations.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Chip
                    label={row.shift}
                    color={row.shift === 'morning' ? 'success' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.room}</TableCell>
                <TableCell>{row.capacity}</TableCell>
                <TableCell>
                  {row.allocations.map((alloc, i) => (
                    <Chip
                      key={i}
                      label={`${alloc.dept}(${alloc.students})`}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>{row.totalStudents}</TableCell>
                <TableCell>{row.teachersRequired}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTeacherAssignments = () => {
    if (!allocationData?.teacherAssignments) return null;

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Shift</strong></TableCell>
              <TableCell><strong>Room</strong></TableCell>
              <TableCell><strong>Teachers Assigned</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocationData.teacherAssignments.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Chip
                    label={row.shift}
                    color={row.shift === 'morning' ? 'success' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.room}</TableCell>
                <TableCell>
                  {row.teachers.split(', ').map((teacher, i) => (
                    <Chip
                      key={i}
                      label={teacher}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTeacherDutyLoad = () => {
    if (!allocationData?.teacherDutyLoad) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Teacher Duty Distribution</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  Below Average ({allocationData.summary?.averageDutyPerTeacher} duties)
                </Typography>
                <TableContainer component={Paper} size="small">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Duties</TableCell>
                        <TableCell>Experience</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allocationData.distribution?.belowAverage.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>{teacher.name}</TableCell>
                          <TableCell>{teacher.dutiesAssigned}</TableCell>
                          <TableCell>
                            <Chip
                              label={teacher.experience}
                              size="small"
                              color={teacher.experience === 'experienced' ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="success.main" gutterBottom>
                  Above Average ({allocationData.summary?.averageDutyPerTeacher} duties)
                </Typography>
                <TableContainer component={Paper} size="small">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Duties</TableCell>
                        <TableCell>Experience</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allocationData.distribution?.aboveAverage.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>{teacher.name}</TableCell>
                          <TableCell>{teacher.dutiesAssigned}</TableCell>
                          <TableCell>
                            <Chip
                              label={teacher.experience}
                              size="small"
                              color={teacher.experience === 'experienced' ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  const renderBranchesManagement = () => {
    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Branches Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddBranch}>
            Add Branch
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id} hover>
                  <TableCell>{branch.id}</TableCell>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.code}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditBranch(branch)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteBranch(branch.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={branchDialogOpen} onClose={() => setBranchDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={branchForm.name}
              onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Code"
              fullWidth
              variant="outlined"
              value={branchForm.code}
              onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBranchDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBranch} variant="contained">
              {editingBranch ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderExamsManagement = () => {
    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Exams Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddExam}>
            Add Exam
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Students</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Shift</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id} hover>
                  <TableCell>{exam.id}</TableCell>
                  <TableCell>{exam.name}</TableCell>
                  <TableCell>{exam.department}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.eligibleStudents}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={exam.shift}
                      color={exam.shift === 'morning' ? 'success' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditExam(exam)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExam(exam.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={examDialogOpen} onClose={() => setExamDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingExam ? 'Edit Exam' : 'Add Exam'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={examForm.department}
                  onChange={(e) => setExamForm({ ...examForm, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Eligible Students"
                  type="number"
                  value={examForm.eligibleStudents}
                  onChange={(e) => setExamForm({ ...examForm, eligibleStudents: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={examForm.date}
                  onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Shift"
                  value={examForm.shift}
                  onChange={(e) => setExamForm({ ...examForm, shift: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={examForm.startTime}
                  onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={examForm.endTime}
                  onChange={(e) => setExamForm({ ...examForm, endTime: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExamDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveExam} variant="contained">
              {editingExam ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderTeachersManagement = () => {
    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Teachers Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddTeacher}>
            Add Teacher
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Experience</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id} hover>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={teacher.experience}
                      color={teacher.experience === 'experienced' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditTeacher(teacher)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTeacher(teacher.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={teacherDialogOpen} onClose={() => setTeacherDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={teacherForm.department}
                  onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Joining"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={teacherForm.dateOfJoining}
                  onChange={(e) => setTeacherForm({ ...teacherForm, dateOfJoining: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Experience"
                  value={teacherForm.experience}
                  onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="new">New</option>
                  <option value="experienced">Experienced</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTeacherDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTeacher} variant="contained">
              {editingTeacher ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderRoomsManagement = () => {
    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Rooms Management</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddRoom}>
            Add Room
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Capacity</strong></TableCell>
                <TableCell><strong>Building</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id} hover>
                  <TableCell>{room.id}</TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.building}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditRoom(room)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRoom(room.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingRoom ? 'Edit Room' : 'Add Room'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={roomForm.name}
              onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={roomForm.capacity}
              onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Building"
              fullWidth
              variant="outlined"
              value={roomForm.building}
              onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRoomDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRoom} variant="contained">
              {editingRoom ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        🧮 Exam Room Allocation System
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={fetchAllocation}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
        >
          {loading ? 'Allocating...' : 'Run Allocation'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {allocationData && (
        <>
          {renderSummaryCards()}

          <Paper sx={{ mb: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Allocation Results" />
              <Tab label="Admin Panel" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <>
                  <Tabs value={allocationSubTab} onChange={handleAllocationSubTabChange} centered>
                    <Tab label="Room Allocations" />
                    <Tab label="Teacher Assignments" />
                    <Tab label="Duty Analysis" />
                  </Tabs>
                  <Box sx={{ mt: 2 }}>
                    {allocationSubTab === 0 && renderRoomAllocations()}
                    {allocationSubTab === 1 && renderTeacherAssignments()}
                    {allocationSubTab === 2 && renderTeacherDutyLoad()}
                  </Box>
                </>
              )}
              {activeTab === 1 && (
                <>
                  <Tabs value={adminTab} onChange={handleAdminTabChange} centered>
                    <Tab label="Branches" />
                    <Tab label="Rooms" />
                    <Tab label="Exams" />
                    <Tab label="Teachers" />
                  </Tabs>
                  <Box sx={{ mt: 2 }}>
                    {adminTab === 0 && renderBranchesManagement()}
                    {adminTab === 1 && renderRoomsManagement()}
                    {adminTab === 2 && renderExamsManagement()}
                    {adminTab === 3 && renderTeachersManagement()}
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
}

export default App;
