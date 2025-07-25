import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import ClockInOut from './ClockInOut';
import LeaveApplication from './LeaveApplication';
import ProfileSettings from './ProfileSettings';
import NotificationList from './NotificationList';
import MyAttendance from './MyAttendance';
import { FaClock, FaCalendarAlt, FaUser, FaBell, FaChartLine } from 'react-icons/fa';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.empName}!`);
    }
  }, [user]);

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Employee Dashboard</h1>
            <div className="text-muted">
              Welcome, {user?.empName}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaClock size={40} className="me-3" />
                <div>
                  <h3>Today</h3>
                  <p>Track your time</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaCalendarAlt size={40} className="me-3" />
                <div>
                  <h3>Leaves</h3>
                  <p>Manage requests</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaChartLine size={40} className="me-3" />
                <div>
                  <h3>Reports</h3>
                  <p>View attendance</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaBell size={40} className="me-3" />
                <div>
                  <h3>Updates</h3>
                  <p>Latest notices</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab 
                  eventKey="attendance" 
                  title={
                    <span>
                      <FaClock className="me-2" />
                      Clock In/Out
                    </span>
                  }
                >
                  <ClockInOut />
                </Tab>
                
                <Tab 
                  eventKey="leave" 
                  title={
                    <span>
                      <FaCalendarAlt className="me-2" />
                      Leave Application
                    </span>
                  }
                >
                  <LeaveApplication />
                </Tab>
                
                <Tab 
                  eventKey="profile" 
                  title={
                    <span>
                      <FaUser className="me-2" />
                      Profile
                    </span>
                  }
                >
                  <ProfileSettings />
                </Tab>
                
                <Tab 
                  eventKey="notifications" 
                  title={
                    <span>
                      <FaBell className="me-2" />
                      Notifications
                    </span>
                  }
                >
                  <NotificationList />
                </Tab>
                
                <Tab 
                  eventKey="my-attendance" 
                  title={
                    <span>
                      <FaChartLine className="me-2" />
                      My Attendance
                    </span>
                  }
                >
                  <MyAttendance />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeDashboard;
