import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Form, InputGroup, Row, Col, Card, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { benchAPI } from '../../services/api';
import { FaSearch, FaUsers, FaEdit, FaEye } from 'react-icons/fa';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Using bench API to get employee list
      const response = await benchAPI.getBenchList({ isActive: true });
      
      if (response.data.success) {
        setEmployees(response.data.data || []);
      } else {
        // Using sample data for demo
        generateSampleEmployees();
      }
    } catch (error) {
      console.log('API not available, using sample data');
      generateSampleEmployees();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleEmployees = () => {
    const sampleEmployees = [
      {
        _id: '1',
        empName: 'John Doe',
        empEmail: 'john.doe@company.com',
        empPhoneNo: '1234567890',
        empCity: 'New York',
        empTechnologies: 'React',
        empWorkingStatus: 'Working',
        empRole: 'Employee',
        createdAt: '2023-01-15'
      },
      {
        _id: '2',
        empName: 'Jane Smith',
        empEmail: 'jane.smith@company.com',
        empPhoneNo: '0987654321',
        empCity: 'San Francisco',
        empTechnologies: 'Node.js',
        empWorkingStatus: 'Working',
        empRole: 'Employee',
        createdAt: '2023-02-20'
      },
      {
        _id: '3',
        empName: 'Mike Johnson',
        empEmail: 'mike.johnson@company.com',
        empPhoneNo: '5555555555',
        empCity: 'Chicago',
        empTechnologies: 'Python',
        empWorkingStatus: 'Bench',
        empRole: 'Employee',
        createdAt: '2023-03-10'
      },
      {
        _id: '4',
        empName: 'Sarah Wilson',
        empEmail: 'sarah.wilson@company.com',
        empPhoneNo: '7777777777',
        empCity: 'Los Angeles',
        empTechnologies: 'Java',
        empWorkingStatus: 'Working',
        empRole: 'Admin',
        createdAt: '2023-01-05'
      },
      {
        _id: '5',
        empName: 'David Brown',
        empEmail: 'david.brown@company.com',
        empPhoneNo: '8888888888',
        empCity: 'Boston',
        empTechnologies: 'Angular',
        empWorkingStatus: 'Working',
        empRole: 'Employee',
        createdAt: '2023-04-12'
      }
    ];
    setEmployees(sampleEmployees);
  };

  const filterEmployees = () => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.empName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empTechnologies?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empCity?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.length > 0) {
      setLoading(true);
      try {
        const response = await benchAPI.searchEmployee(searchTerm);
        if (response.data.success) {
          setFilteredEmployees(response.data.data || []);
        }
      } catch (error) {
        console.log('Search API not available, using local filter');
        filterEmployees();
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredEmployees(employees);
    }
  };

  const handleStatusUpdate = async (empId, newStatus) => {
    try {
      const response = await benchAPI.updateStatus({
        empId: empId,
        empWorkingStatus: newStatus,
        isActive: true
      });

      if (response.data.success) {
        toast.success('Employee status updated successfully');
        fetchEmployees(); // Refresh the list
      } else {
        toast.error('Failed to update employee status');
      }
    } catch (error) {
      toast.error('Failed to update employee status');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Working':
        return <Badge bg="success">Working</Badge>;
      case 'Bench':
        return <Badge bg="warning">Bench</Badge>;
      case 'Inactive':
        return <Badge bg="danger">Inactive</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    return role === 'Admin' ? 
      <Badge bg="primary">Admin</Badge> : 
      <Badge bg="info">Employee</Badge>;
  };

  const showEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  return (
    <div className="fade-in">
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <FaUsers className="me-2" />
                Employee Management
              </h4>
            </Col>
            <Col md={4}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="outline-secondary" onClick={handleSearch}>
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Technology</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="text-muted">
                        {searchTerm ? 'No employees found matching your search.' : 'No employees found.'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <div>
                          <strong>{employee.empName}</strong>
                          <br />
                          <small className="text-muted">
                            ID: {employee._id?.slice(-8).toUpperCase()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{employee.empEmail}</div>
                          <small className="text-muted">{employee.empPhoneNo}</small>
                        </div>
                      </td>
                      <td>{employee.empCity}</td>
                      <td>
                        <Badge variant="outline-secondary">
                          {employee.empTechnologies}
                        </Badge>
                      </td>
                      <td>{getStatusBadge(employee.empWorkingStatus)}</td>
                      <td>{getRoleBadge(employee.empRole)}</td>
                      <td>
                        {employee.createdAt ? 
                          new Date(employee.createdAt).toLocaleDateString() : 
                          'N/A'
                        }
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => showEmployeeDetails(employee)}
                          >
                            <FaEye />
                          </Button>
                          <div className="btn-group">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleStatusUpdate(employee._id, 
                                employee.empWorkingStatus === 'Working' ? 'Bench' : 'Working'
                              )}
                            >
                              <FaEdit />
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Employee Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <Row>
              <Col md={6}>
                <h6>Personal Information</h6>
                <p><strong>Name:</strong> {selectedEmployee.empName}</p>
                <p><strong>Email:</strong> {selectedEmployee.empEmail}</p>
                <p><strong>Phone:</strong> {selectedEmployee.empPhoneNo}</p>
                <p><strong>Gender:</strong> {selectedEmployee.empGender || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedEmployee.empAddress || 'N/A'}</p>
              </Col>
              <Col md={6}>
                <h6>Work Information</h6>
                <p><strong>Employee ID:</strong> {selectedEmployee._id?.slice(-8).toUpperCase()}</p>
                <p><strong>Role:</strong> {selectedEmployee.empRole}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedEmployee.empWorkingStatus)}</p>
                <p><strong>Technology:</strong> {selectedEmployee.empTechnologies}</p>
                <p><strong>City:</strong> {selectedEmployee.empCity}</p>
                <p><strong>Join Date:</strong> {
                  selectedEmployee.createdAt ? 
                    new Date(selectedEmployee.createdAt).toLocaleDateString() : 
                    'N/A'
                }</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
