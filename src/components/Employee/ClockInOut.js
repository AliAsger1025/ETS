import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
import { timesheetAPI } from '../../services/api';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const ClockInOut = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(moment());
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [workingFrom, setWorkingFrom] = useState('Office');
  const [loading, setLoading] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    // Check if already clocked in today
    checkTodayStatus();

    return () => clearInterval(timer);
  }, []);

  const checkTodayStatus = () => {
    // In a real implementation, you would fetch today's timesheet data
    // For now, we'll use localStorage to simulate this
    const todayKey = `timesheet_${user?._id}_${moment().format('YYYY-MM-DD')}`;
    const todaysData = localStorage.getItem(todayKey);
    
    if (todaysData) {
      const data = JSON.parse(todaysData);
      setClockedIn(!!data.empClockIn && !data.empClockOut);
      setClockInTime(data.empClockIn ? moment(data.empClockIn) : null);
      setTodayStatus(data);
    }
  };

  const handleClockIn = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const clockData = {
        empWorkingFrom: workingFrom,
        empClockInIp: '192.168.1.1', // In real app, get actual IP
        isActive: true
      };

      const response = await timesheetAPI.clockIn(user._id, clockData);
      
      if (response.data.success) {
        const clockInTime = moment();
        setClockedIn(true);
        setClockInTime(clockInTime);
        
        // Store in localStorage for demo purposes
        const todayKey = `timesheet_${user._id}_${moment().format('YYYY-MM-DD')}`;
        const data = {
          empClockIn: clockInTime.toISOString(),
          empWorkingFrom: workingFrom,
          empClockOut: null
        };
        localStorage.setItem(todayKey, JSON.stringify(data));
        setTodayStatus(data);
        
        toast.success(`Clocked in successfully at ${clockInTime.format('HH:mm:ss')}`);
      } else {
        toast.error(response.data.message || 'Failed to clock in');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user?._id || !clockInTime) return;

    setLoading(true);
    try {
      const clockOutTime = moment();
      const hoursWorked = clockOutTime.diff(clockInTime, 'hours', true);
      
      const attendanceData = {
        empClockOut: clockOutTime.format('HH:mm:ss'),
        empHoursLogged: Math.round(hoursWorked * 100) / 100,
        empStatus: 'Present',
        isActive: true
      };

      const response = await timesheetAPI.updateAttendance(user._id, attendanceData);
      
      if (response.data.success) {
        setClockedIn(false);
        
        // Update localStorage
        const todayKey = `timesheet_${user._id}_${moment().format('YYYY-MM-DD')}`;
        const existingData = JSON.parse(localStorage.getItem(todayKey) || '{}');
        const updatedData = {
          ...existingData,
          empClockOut: clockOutTime.toISOString(),
          empHoursLogged: hoursWorked
        };
        localStorage.setItem(todayKey, JSON.stringify(updatedData));
        setTodayStatus(updatedData);
        
        toast.success(`Clocked out successfully at ${clockOutTime.format('HH:mm:ss')}. Hours worked: ${hoursWorked.toFixed(2)}`);
      } else {
        toast.error(response.data.message || 'Failed to clock out');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (clockedIn) return 'success';
    if (todayStatus?.empClockOut) return 'info';
    return 'warning';
  };

  const getStatusText = () => {
    if (clockedIn) return 'Currently Working';
    if (todayStatus?.empClockOut) return 'Work Completed';
    return 'Not Clocked In';
  };

  return (
    <div className="fade-in">
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="text-center">
            <Card.Header>
              <h4 className="mb-0">
                <FaClock className="me-2" />
                Time Tracking
              </h4>
            </Card.Header>
            <Card.Body className="py-4">
              <div className="mb-4">
                <h2 className="display-4 text-primary mb-2">
                  {currentTime.format('HH:mm:ss')}
                </h2>
                <p className="text-muted h5 mb-0">
                  {currentTime.format('dddd, MMMM Do YYYY')}
                </p>
              </div>

              <Alert variant={getStatusColor()} className="mb-4">
                <strong>Status:</strong> {getStatusText()}
                {clockInTime && (
                  <div className="mt-2">
                    <small>
                      Clocked in at: {clockInTime.format('HH:mm:ss')}
                    </small>
                  </div>
                )}
              </Alert>

              {!clockedIn && !todayStatus?.empClockOut && (
                <div className="mb-4">
                  <Form.Group>
                    <Form.Label className="h6">
                      <FaMapMarkerAlt className="me-2" />
                      Working From
                    </Form.Label>
                    <Form.Select
                      value={workingFrom}
                      onChange={(e) => setWorkingFrom(e.target.value)}
                      className="form-control-lg"
                    >
                      <option value="Office">Office</option>
                      <option value="Home">Work from Home</option>
                      <option value="Client Site">Client Site</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              )}

              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                {!clockedIn && !todayStatus?.empClockOut && (
                  <Button
                    variant="success"
                    size="lg"
                    className="clock-btn clock-in-btn px-5"
                    onClick={handleClockIn}
                    disabled={loading}
                  >
                    {loading ? 'Clocking In...' : 'Clock In'}
                  </Button>
                )}

                {clockedIn && (
                  <Button
                    variant="danger"
                    size="lg"
                    className="clock-btn clock-out-btn px-5"
                    onClick={handleClockOut}
                    disabled={loading}
                  >
                    {loading ? 'Clocking Out...' : 'Clock Out'}
                  </Button>
                )}
              </div>

              {todayStatus?.empClockOut && (
                <div className="mt-4 p-3 bg-light rounded">
                  <h6>Today's Summary</h6>
                  <Row>
                    <Col sm={4}>
                      <strong>Clock In:</strong><br />
                      {moment(todayStatus.empClockIn).format('HH:mm:ss')}
                    </Col>
                    <Col sm={4}>
                      <strong>Clock Out:</strong><br />
                      {moment(todayStatus.empClockOut).format('HH:mm:ss')}
                    </Col>
                    <Col sm={4}>
                      <strong>Hours Worked:</strong><br />
                      {todayStatus.empHoursLogged?.toFixed(2) || '0.00'} hrs
                    </Col>
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClockInOut;
