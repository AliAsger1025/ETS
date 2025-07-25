import React from 'react';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar variant="dark" expand="lg" className="navbar">
      <Container>
        <BootstrapNavbar.Brand href="/dashboard">
          Employee Tracking System
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            {isAdmin() && (
              <>
                <Nav.Link href="/admin/employees">Employees</Nav.Link>
                <Nav.Link href="/admin/attendance">Attendance</Nav.Link>
                <Nav.Link href="/admin/leaves">Leave Requests</Nav.Link>
                <Nav.Link href="/admin/notices">Notices</Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            <NavDropdown 
              title={
                <span>
                  <FaUser className="me-2" />
                  {user?.empName || user?.name || 'User'}
                </span>
              } 
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item href="/profile">
                <FaCog className="me-2" />
                Profile Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
