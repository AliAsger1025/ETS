import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
import { FaChartLine, FaCalendarAlt, FaDownload } from 'react-icons/fa';

const MyAttendance = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateArrivals: 0,
    totalHours: 0
  });

  useEffect(() => {
    generateSampleData();
  }, [selectedMonth]);

  const generateSampleData = () => {
    // Generate sample attendance data for demo purposes
    const startDate = moment(selectedMonth).startOf('month');
    const endDate = moment(selectedMonth).endOf('month');
    const sampleData = [];
    
    const currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      // Skip weekends for demo
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        const isPresent = Math.random() > 0.1; // 90% attendance rate
        const clockIn = isPresent ? 
          moment(currentDate).hour(9).minute(Math.floor(Math.random() * 60)) : null;
        const clockOut = isPresent ? 
          moment(clockIn).add(8 + Math.random() * 2, 'hours') : null;
        
        // Check if existing data for today exists in localStorage
        const todayKey = `timesheet_${user?._id}_${currentDate.format('YYYY-MM-DD')}`;
        const existingData = localStorage.getItem(todayKey);
        
        let dayData;
        if (existingData && currentDate.isSame(moment(), 'day')) {
          // Use real data for today if available
          const realData = JSON.parse(existingData);
          dayData = {
            date: currentDate.clone(),
            clockIn: realData.empClockIn ? moment(realData.empClockIn) : null,
            clockOut: realData.empClockOut ? moment(realData.empClockOut) : null,
            status: realData.empClockIn ? 'Present' : 'Absent',
            workingFrom: realData.empWorkingFrom || 'Office',
            hoursWorked: realData.empHoursLogged || 0,
            isLate: realData.empClockIn ? moment(realData.empClockIn).hour() > 9 : false
          };
        } else {
          dayData = {
            date: currentDate.clone(),
            clockIn: clockIn,
            clockOut: clockOut,
            status: isPresent ? 'Present' : 'Absent',
            workingFrom: Math.random() > 0.3 ? 'Office' : 'Home',
            hoursWorked: clockOut ? clockOut.diff(clockIn, 'hours', true) : 0,
            isLate: clockIn ? clockIn.hour() > 9 || (clockIn.hour() === 9 && clockIn.minute() > 15) : false
          };
        }
        
        sampleData.push(dayData);
      }
      currentDate.add(1, 'day');
    }
    
    setAttendanceData(sampleData);
    setFilteredData(sampleData);
    calculateStats(sampleData);
  };

  const calculateStats = (data) => {
    const totalDays = data.length;
    const presentDays = data.filter(d => d.status === 'Present').length;
    const absentDays = totalDays - presentDays;
    const lateArrivals = data.filter(d => d.isLate).length;
    const totalHours = data.reduce((sum, d) => sum + (d.hoursWorked || 0), 0);

    setStats({
      totalDays,
      presentDays,
      absentDays,
      lateArrivals,
      totalHours: Math.round(totalHours * 100) / 100
    });
  };

  const getStatusBadge = (status, isLate) => {
    if (status === 'Present') {
      return (
        <Badge bg={isLate ? 'warning' : 'success'}>
          {isLate ? 'Present (Late)' : 'Present'}
        </Badge>
      );
    }
    return <Badge bg="danger">Absent</Badge>;
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const exportAttendance = () => {
    // Simple CSV export
    const csvContent = [
      ['Date', 'Status', 'Clock In', 'Clock Out', 'Hours Worked', 'Working From'],
      ...filteredData.map(row => [
        row.date.format('YYYY-MM-DD'),
        row.status + (row.isLate ? ' (Late)' : ''),
        row.clockIn ? row.clockIn.format('HH:mm') : '-',
        row.clockOut ? row.clockOut.format('HH:mm') : '-',
        row.hoursWorked ? row.hoursWorked.toFixed(2) : '0.00',
        row.workingFrom
      ])
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in">
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">
                <FaChartLine className="me-2" />
                My Attendance Summary
              </h4>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={3}>
                  <div className="p-3">
                    <h3 className="text-success">{stats.presentDays}</h3>
                    <small>Present Days</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3">
                    <h3 className="text-danger">{stats.absentDays}</h3>
                    <small>Absent Days</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3">
                    <h3 className="text-warning">{stats.lateArrivals}</h3>
                    <small>Late Arrivals</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3">
                    <h3 className="text-info">{stats.totalHours}</h3>
                    <small>Total Hours</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Attendance Rate</h6>
              <div className="progress mb-3" style={{ height: '20px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ 
                    width: `${stats.totalDays > 0 ? (stats.presentDays / stats.totalDays) * 100 : 0}%` 
                  }}
                >
                  {stats.totalDays > 0 ? Math.round((stats.presentDays / stats.totalDays) * 100) : 0}%
                </div>
              </div>
              <p className="text-muted mb-0">
                {stats.presentDays} out of {stats.totalDays} working days
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Attendance Details
              </h4>
            </Col>
            <Col md={3}>
              <Form.Control
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                max={moment().format('YYYY-MM')}
              />
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" onClick={exportAttendance} className="w-100">
                <FaDownload className="me-1" />
                Export
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Hours Worked</th>
                  <th>Working From</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">
                        No attendance data found for the selected month.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <strong>{record.date.format('MMM DD, YYYY')}</strong>
                          <br />
                          <small className="text-muted">
                            {record.date.format('dddd')}
                          </small>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(record.status, record.isLate)}
                      </td>
                      <td>
                        {record.clockIn ? record.clockIn.format('HH:mm') : '-'}
                      </td>
                      <td>
                        {record.clockOut ? record.clockOut.format('HH:mm') : '-'}
                      </td>
                      <td>
                        {record.hoursWorked > 0 ? `${record.hoursWorked.toFixed(2)} hrs` : '-'}
                      </td>
                      <td>
                        <Badge variant="outline-secondary">
                          {record.workingFrom}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MyAttendance;
