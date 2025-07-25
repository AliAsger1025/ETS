import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import EmployeeManagement from './EmployeeManagement';
import AttendanceOverview from './AttendanceOverview';
import LeaveRequests from './LeaveRequests';
import NoticeManagement from './NoticeManagement';
import { FaUsers, FaClock, FaCalendarAlt, FaBell, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    totalNotices: 0
  });

  useEffect(() => {
    if (user) {
      toast.success(`Welcome to Admin Dashboard, ${user.empName}!`);
    }
    loadDashboardStats();
  }, [user]);

  const loadDashboardStats = () => {
    // In a real app, these would come from API calls
    // For demo, using sample data
    setDashboardStats({
      totalEmployees: 45,
      presentToday: 38,
      pendingLeaves: 7,
      totalNotices: 12
    });
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Admin Dashboard</h1>
            <div className="text-muted">
              Welcome, {user?.empName} (Administrator)
            </div>
          </div>
        </Col>
      </Row>

      {/* Dashboard Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaUsers size={40} className="me-3" />
                <div>
                  <h3>{dashboardStats.totalEmployees}</h3>
                  <p>Total Employees</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaClock size={40} className="me-3" />
                <div>
                  <h3>{dashboardStats.presentToday}</h3>
                  <p>Present Today</p>
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
                  <h3>{dashboardStats.pendingLeaves}</h3>
                  <p>Pending Leaves</p>
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
                  <h3>{dashboardStats.totalNotices}</h3>
                  <p>Active Notices</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
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
                  eventKey="overview" 
                  title={
                    <span>
                      <FaChartBar className="me-2" />
                      Overview
                    </span>
                  }
                >
                  <AttendanceOverview />
                </Tab>
                
                <Tab 
                  eventKey="employees" 
                  title={
                    <span>
                      <FaUsers className="me-2" />
                      Employees
                    </span>
                  }
                >
                  <EmployeeManagement />
                </Tab>
                
                <Tab 
                  eventKey="attendance" 
                  title={
                    <span>
                      <FaClock className="me-2" />
                      Attendance
                    </span>
                  }
                >
                  <AttendanceOverview showDetails={true} />
                </Tab>
                
                <Tab 
                  eventKey="leaves" 
                  title={
                    <span>
                      <FaCalendarAlt className="me-2" />
                      Leave Requests
                    </span>
                  }
                >
                  <LeaveRequests />
                </Tab>
                
                <Tab 
                  eventKey="notices" 
                  title={
                    <span>
                      <FaBell className="me-2" />
                      Notices
                    </span>
                  }
                >
                  <NoticeManagement />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
