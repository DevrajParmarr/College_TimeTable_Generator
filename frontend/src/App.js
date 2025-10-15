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
} from '@mui/material';
import {
  School,
  Person,
  Room,
  Assessment,
  ExpandMore,
  Refresh,
} from '@mui/icons-material';
import axios from 'axios';
import './App.css';

function App() {
  const [allocationData, setAllocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
              <Tab label="Room Allocations" />
              <Tab label="Teacher Assignments" />
              <Tab label="Duty Analysis" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && renderRoomAllocations()}
              {activeTab === 1 && renderTeacherAssignments()}
              {activeTab === 2 && renderTeacherDutyLoad()}
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
}

export default App;
