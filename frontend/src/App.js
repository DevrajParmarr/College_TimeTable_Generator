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
  InputAdornment,
  Fab,
  Tooltip,
  Snackbar,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Search,
  AdminPanelSettings,
  Save,
  Cancel,
  CheckCircle,
  ArrowUpward,
  ArrowDownward,
  PlayArrow,
  Settings,
  TrendingUp,
  Assignment,
  Group,
  MeetingRoom,
  EventNote,
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('');

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
        setSnackbar({ open: true, message: 'Branch deleted successfully!', severity: 'success' });
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete branch:', err);
        setSnackbar({ open: true, message: 'Failed to delete branch', severity: 'error' });
      }
    }
  };

  const handleSaveBranch = async () => {
    try {
      if (editingBranch) {
        await axios.put(`${API_BASE_URL}/branches/${editingBranch.id}`, branchForm);
        setSnackbar({ open: true, message: 'Branch updated successfully!', severity: 'success' });
      } else {
        await axios.post(`${API_BASE_URL}/branches`, branchForm);
        setSnackbar({ open: true, message: 'Branch added successfully!', severity: 'success' });
      }
      setBranchDialogOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save branch:', err);
      setSnackbar({ open: true, message: 'Failed to save branch', severity: 'error' });
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
        setSnackbar({ open: true, message: 'Room deleted successfully!', severity: 'success' });
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete room:', err);
        setSnackbar({ open: true, message: 'Failed to delete room', severity: 'error' });
      }
    }
  };

  const handleSaveRoom = async () => {
    try {
      const formData = { ...roomForm, capacity: parseInt(roomForm.capacity) };
      if (editingRoom) {
        await axios.put(`${API_BASE_URL}/rooms/${editingRoom.id}`, formData);
        setSnackbar({ open: true, message: 'Room updated successfully!', severity: 'success' });
      } else {
        await axios.post(`${API_BASE_URL}/rooms`, formData);
        setSnackbar({ open: true, message: 'Room added successfully!', severity: 'success' });
      }
      setRoomDialogOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save room:', err);
      setSnackbar({ open: true, message: 'Failed to save room', severity: 'error' });
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
        setSnackbar({ open: true, message: 'Exam deleted successfully!', severity: 'success' });
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete exam:', err);
        setSnackbar({ open: true, message: 'Failed to delete exam', severity: 'error' });
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
        setSnackbar({ open: true, message: 'Exam updated successfully!', severity: 'success' });
      } else {
        await axios.post(`${API_BASE_URL}/exams`, formData);
        setSnackbar({ open: true, message: 'Exam added successfully!', severity: 'success' });
      }
      setExamDialogOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save exam:', err);
      setSnackbar({ open: true, message: 'Failed to save exam', severity: 'error' });
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
        setSnackbar({ open: true, message: 'Teacher deleted successfully!', severity: 'success' });
        fetchAdminData();
      } catch (err) {
        console.error('Failed to delete teacher:', err);
        setSnackbar({ open: true, message: 'Failed to delete teacher', severity: 'error' });
      }
    }
  };

  const handleSaveTeacher = async () => {
    try {
      if (editingTeacher) {
        await axios.put(`${API_BASE_URL}/teachers/${editingTeacher.id}`, teacherForm);
        setSnackbar({ open: true, message: 'Teacher updated successfully!', severity: 'success' });
      } else {
        await axios.post(`${API_BASE_URL}/teachers`, teacherForm);
        setSnackbar({ open: true, message: 'Teacher added successfully!', severity: 'success' });
      }
      setTeacherDialogOpen(false);
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save teacher:', err);
      setSnackbar({ open: true, message: 'Failed to save teacher', severity: 'error' });
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
                  {Array.isArray(row.teachers) ? row.teachers.map((teacher, i) => (
                    <Chip
                      key={i}
                      label={teacher}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  )) : (
                    <Chip
                      label={row.teachers}
                      size="small"
                      color={row.teachers === "Unassigned" ? "error" : "default"}
                    />
                  )}
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
    const filteredBranches = branches
      .filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortBy) return 0;
        const aVal = sortBy === 'name' ? a.name : a.code;
        const bVal = sortBy === 'name' ? b.name : b.code;
        if (sortOrder === 'asc') {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      });

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminPanelSettings color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Branches Management</Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>Sort by:</Typography>
            <Button
              size="small"
              variant={sortBy === 'name' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'name' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Name
            </Button>
            <Button
              size="small"
              variant={sortBy === 'code' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('code');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'code' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Code
            </Button>
          </Box>
          <Tooltip title="Add New Branch">
            <Fab color="primary" size="small" onClick={handleAddBranch}>
              <Add />
            </Fab>
          </Tooltip>
        </Box>

        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Code</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBranches
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((branch) => (
                <TableRow key={branch.id} hover sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                  <TableCell>{branch.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{branch.name}</TableCell>
                  <TableCell>
                    <Chip label={branch.code} color="secondary" size="small" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Branch">
                      <IconButton onClick={() => handleEditBranch(branch)} color="primary" size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Branch">
                      <IconButton onClick={() => handleDeleteBranch(branch.id)} color="error" size="small">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredBranches.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        <Dialog open={branchDialogOpen} onClose={() => setBranchDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingBranch ? <Edit color="primary" /> : <Add color="primary" />}
            {editingBranch ? 'Edit Branch' : 'Add New Branch'}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Branch Name"
              fullWidth
              variant="outlined"
              value={branchForm.name}
              onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
              helperText="Enter the full name of the branch"
            />
            <TextField
              margin="dense"
              label="Branch Code"
              fullWidth
              variant="outlined"
              value={branchForm.code}
              onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
              helperText="Enter the abbreviated code (e.g., CSE, IT)"
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setBranchDialogOpen(false)}
              startIcon={<Cancel />}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBranch}
              variant="contained"
              startIcon={editingBranch ? <CheckCircle /> : <Save />}
              color="primary"
            >
              {editingBranch ? 'Update Branch' : 'Save Branch'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderExamsManagement = () => {
    const filteredExams = exams
      .filter(exam =>
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortBy) return 0;
        let aVal, bVal;
        if (sortBy === 'name') {
          aVal = a.name;
          bVal = b.name;
        } else if (sortBy === 'date') {
          aVal = new Date(a.date);
          bVal = new Date(b.date);
        } else if (sortBy === 'students') {
          aVal = a.eligibleStudents;
          bVal = b.eligibleStudents;
        }
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Assessment color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Exams Management</Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>Sort by:</Typography>
            <Button
              size="small"
              variant={sortBy === 'name' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'name' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Name
            </Button>
            <Button
              size="small"
              variant={sortBy === 'date' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('date');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'date' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Date
            </Button>
            <Button
              size="small"
              variant={sortBy === 'students' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('students');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'students' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Students
            </Button>
          </Box>
          <Tooltip title="Add New Exam">
            <Fab color="primary" size="small" onClick={handleAddExam}>
              <Add />
            </Fab>
          </Tooltip>
        </Box>

        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Students</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Shift</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((exam) => (
                <TableRow key={exam.id} hover sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                  <TableCell>{exam.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{exam.name}</TableCell>
                  <TableCell>
                    <Chip label={exam.department} color="secondary" size="small" />
                  </TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${exam.eligibleStudents} students`}
                      color="info"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={exam.shift}
                      color={exam.shift === 'morning' ? 'success' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Exam">
                      <IconButton onClick={() => handleEditExam(exam)} color="primary" size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Exam">
                      <IconButton onClick={() => handleDeleteExam(exam.id)} color="error" size="small">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredExams.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        <Dialog open={examDialogOpen} onClose={() => setExamDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingExam ? <Edit color="primary" /> : <Add color="primary" />}
            {editingExam ? 'Edit Exam' : 'Add New Exam'}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Exam Name"
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                  helperText="Enter the exam name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={examForm.department}
                    onChange={(e) => setExamForm({ ...examForm, department: e.target.value })}
                    label="Department"
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.code} value={branch.code}>
                        {branch.name} ({branch.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                  helperText="Subject name or code"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Eligible Students"
                  type="number"
                  value={examForm.eligibleStudents}
                  onChange={(e) => setExamForm({ ...examForm, eligibleStudents: e.target.value })}
                  helperText="Number of students taking this exam"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Exam Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={examForm.date}
                  onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                  helperText="Select the exam date"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Shift</InputLabel>
                  <Select
                    value={examForm.shift}
                    onChange={(e) => setExamForm({ ...examForm, shift: e.target.value })}
                    label="Shift"
                  >
                    <MenuItem value="morning">Morning (9:00 - 12:00)</MenuItem>
                    <MenuItem value="afternoon">Afternoon (14:00 - 17:00)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={examForm.startTime}
                  onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                  helperText="Exam start time"
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
                  helperText="Exam end time"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setExamDialogOpen(false)}
              startIcon={<Cancel />}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveExam}
              variant="contained"
              startIcon={editingExam ? <CheckCircle /> : <Save />}
              color="primary"
            >
              {editingExam ? 'Update Exam' : 'Save Exam'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderTeachersManagement = () => {
    const filteredTeachers = teachers
      .filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortBy) return 0;
        let aVal, bVal;
        if (sortBy === 'name') {
          aVal = a.name;
          bVal = b.name;
        } else if (sortBy === 'email') {
          aVal = a.email;
          bVal = b.email;
        } else if (sortBy === 'department') {
          aVal = a.department;
          bVal = b.department;
        }
        if (sortOrder === 'asc') {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      });

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Teachers Management</Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>Sort by:</Typography>
            <Button
              size="small"
              variant={sortBy === 'name' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'name' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Name
            </Button>
            <Button
              size="small"
              variant={sortBy === 'email' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('email');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'email' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Email
            </Button>
            <Button
              size="small"
              variant={sortBy === 'department' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('department');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'department' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Department
            </Button>
          </Box>
          <Tooltip title="Add New Teacher">
            <Fab color="primary" size="small" onClick={handleAddTeacher}>
              <Add />
            </Fab>
          </Tooltip>
        </Box>

        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Experience</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Joining Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((teacher) => (
                <TableRow key={teacher.id} hover sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{teacher.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem' }}>{teacher.email}</TableCell>
                  <TableCell>
                    <Chip label={teacher.department} variant="outlined" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={teacher.experience}
                      color={teacher.experience === 'experienced' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(teacher.dateOfJoining).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Teacher">
                      <IconButton onClick={() => handleEditTeacher(teacher)} color="primary" size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Teacher">
                      <IconButton onClick={() => handleDeleteTeacher(teacher.id)} color="error" size="small">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredTeachers.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        <Dialog open={teacherDialogOpen} onClose={() => setTeacherDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingTeacher ? <Edit color="primary" /> : <Add color="primary" />}
            {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  helperText="Enter the teacher's full name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  helperText="Official email address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={teacherForm.department}
                    onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                    label="Department"
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch.code} value={branch.name}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Joining"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={teacherForm.dateOfJoining}
                  onChange={(e) => setTeacherForm({ ...teacherForm, dateOfJoining: e.target.value })}
                  helperText="When did the teacher join?"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                    label="Experience Level"
                  >
                    <MenuItem value="new">New Teacher</MenuItem>
                    <MenuItem value="experienced">Experienced Teacher</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Weekly Availability</Typography>
            <Grid container spacing={2}>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                <Grid item xs={12} sm={6} md={4} key={day}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ textTransform: 'capitalize' }}>{day}</InputLabel>
                    <Select
                      value={teacherForm.weeklyAvailability[day]}
                      onChange={(e) => setTeacherForm({
                        ...teacherForm,
                        weeklyAvailability: {
                          ...teacherForm.weeklyAvailability,
                          [day]: e.target.value
                        }
                      })}
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                    >
                      <MenuItem value="morning">Morning Only</MenuItem>
                      <MenuItem value="afternoon">Afternoon Only</MenuItem>
                      <MenuItem value="both">Both Shifts</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setTeacherDialogOpen(false)}
              startIcon={<Cancel />}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTeacher}
              variant="contained"
              startIcon={editingTeacher ? <CheckCircle /> : <Save />}
              color="primary"
            >
              {editingTeacher ? 'Update Teacher' : 'Save Teacher'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderRoomsManagement = () => {
    const filteredRooms = rooms
      .filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.building.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortBy) return 0;
        let aVal, bVal;
        if (sortBy === 'name') {
          aVal = a.name;
          bVal = b.name;
        } else if (sortBy === 'capacity') {
          aVal = a.capacity;
          bVal = b.capacity;
        } else if (sortBy === 'building') {
          aVal = a.building;
          bVal = b.building;
        }
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Room color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Rooms Management</Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>Sort by:</Typography>
            <Button
              size="small"
              variant={sortBy === 'name' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'name' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Name
            </Button>
            <Button
              size="small"
              variant={sortBy === 'capacity' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('capacity');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'capacity' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Capacity
            </Button>
            <Button
              size="small"
              variant={sortBy === 'building' ? 'contained' : 'outlined'}
              onClick={() => {
                setSortBy('building');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              endIcon={sortBy === 'building' ? (sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Building
            </Button>
          </Box>
          <Tooltip title="Add New Room">
            <Fab color="primary" size="small" onClick={handleAddRoom}>
              <Add />
            </Fab>
          </Tooltip>
        </Box>

        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Capacity</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Building</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRooms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((room) => (
                <TableRow key={room.id} hover sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                  <TableCell>{room.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{room.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${room.capacity} seats`}
                      color={room.capacity > 60 ? 'success' : room.capacity > 40 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={room.building} variant="outlined" size="small" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Room">
                      <IconButton onClick={() => handleEditRoom(room)} color="primary" size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Room">
                      <IconButton onClick={() => handleDeleteRoom(room.id)} color="error" size="small">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredRooms.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>

        <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingRoom ? <Edit color="primary" /> : <Add color="primary" />}
            {editingRoom ? 'Edit Room' : 'Add New Room'}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Room Name"
              fullWidth
              variant="outlined"
              value={roomForm.name}
              onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
              helperText="Enter the room name (e.g., Room 101)"
            />
            <TextField
              margin="dense"
              label="Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={roomForm.capacity}
              onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
              helperText="Maximum number of students the room can accommodate"
              inputProps={{ min: 1, max: 200 }}
            />
            <TextField
              margin="dense"
              label="Building"
              fullWidth
              variant="outlined"
              value={roomForm.building}
              onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
              helperText="Building name or block (e.g., Block A)"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setRoomDialogOpen(false)}
              startIcon={<Cancel />}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRoom}
              variant="contained"
              startIcon={editingRoom ? <CheckCircle /> : <Save />}
              color="primary"
            >
              {editingRoom ? 'Update Room' : 'Save Room'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: 3
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          🧮 Exam Room Allocation System
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Intelligent allocation of exam rooms and teacher assignments for educational institutions
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={fetchAllocation}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              px: 4,
              py: 1.5
            }}
          >
            {loading ? 'Allocating...' : 'Run Allocation'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => setActiveTab(1)}
            startIcon={<Settings />}
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
              },
              px: 4,
              py: 1.5
            }}
          >
            Admin Panel
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {allocationData && (
        <>
          {/* Quick Stats Dashboard */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TrendingUp color="primary" />
              Allocation Overview
            </Typography>
            {renderSummaryCards()}
          </Box>

          <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: 'primary.main', p: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTab-root': { color: 'white', opacity: 0.7 },
                  '& .MuiTab-root.Mui-selected': { color: 'white', opacity: 1 },
                  '& .MuiTabs-indicator': { bgcolor: 'white' }
                }}
              >
                <Tab
                  label="Allocation Results"
                  icon={<Assignment />}
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
                <Tab
                  label="Admin Panel"
                  icon={<AdminPanelSettings />}
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <Tabs
                      value={allocationSubTab}
                      onChange={handleAllocationSubTabChange}
                      variant="fullWidth"
                      sx={{
                        '& .MuiTab-root': { minHeight: 48 },
                        '& .MuiTabs-indicator': { height: 3 }
                      }}
                    >
                      <Tab
                        label="Room Allocations"
                        icon={<MeetingRoom />}
                        iconPosition="start"
                      />
                      <Tab
                        label="Teacher Assignments"
                        icon={<Group />}
                        iconPosition="start"
                      />
                      <Tab
                        label="Duty Analysis"
                        icon={<Assessment />}
                        iconPosition="start"
                      />
                    </Tabs>
                  </Box>
                  <Box sx={{ mt: 3, p: 2 }}>
                    {allocationSubTab === 0 && renderRoomAllocations()}
                    {allocationSubTab === 1 && renderTeacherAssignments()}
                    {allocationSubTab === 2 && renderTeacherDutyLoad()}
                  </Box>
                </>
              )}
              {activeTab === 1 && (
                <>
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <Tabs
                      value={adminTab}
                      onChange={handleAdminTabChange}
                      variant="fullWidth"
                      sx={{
                        '& .MuiTab-root': { minHeight: 48 },
                        '& .MuiTabs-indicator': { height: 3 }
                      }}
                    >
                      <Tab
                        label="Branches"
                        icon={<School />}
                        iconPosition="start"
                      />
                      <Tab
                        label="Rooms"
                        icon={<MeetingRoom />}
                        iconPosition="start"
                      />
                      <Tab
                        label="Exams"
                        icon={<EventNote />}
                        iconPosition="start"
                      />
                      <Tab
                        label="Teachers"
                        icon={<Group />}
                        iconPosition="start"
                      />
                    </Tabs>
                  </Box>
                  <Box sx={{ mt: 3, p: 2 }}>
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


      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
