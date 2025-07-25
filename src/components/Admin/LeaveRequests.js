import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Card, Modal, Row, Col, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { adminAPI } from '../../services/api';
import { FaCalendarAlt, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch leave requests from API
      // For demo, using sample data
      generateSampleLeaveRequests();
    } catch (error) {
      console.log('API not available, using sample data');
      generateSampleLeaveRequests();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleLeaveRequests = () => {
    const sampleRequests = [
      {
        _id: '1',
        empId: { _id: '1', empName: 'John Doe', empEmail: 'john.doe@company.com' },
        leaveType: 'Casual Leave',
        startDate: moment().add(2, 'days').toDate(),
        endDate: moment().add(4, 'days').toDate(),
        message: 'Need to attend family function',
        empStatus: 'Pending',
        casualLeave: 8,
        sickLeave: 10,
        totalLeaves: 22,
        createdAt: moment().subtract(1, 'day').toDate()
      },
      {
        _id: '2',
        empId: { _id: '2', empName: 'Jane Smith', empEmail: 'jane.smith@company.com' },
        leaveType: 'Sick Leave',
        startDate: moment().add(1, 'day').toDate(),
        endDate: moment().add(1, 'day').toDate(),
        message: 'Feeling unwell, need medical rest',
        empStatus: 'Pending',
        casualLeave: 10,
        sickLeave: 9,
        totalLeaves: 22,
        createdAt: moment().subtract(2, 'hours').toDate()
      },
      {
        _id: '3',
        empId: { _id: '3', empName: 'Mike Johnson', empEmail: 'mike.johnson@company.com' },
        leaveType: 'Emergency Leave',
        startDate: moment().subtract(1, 'day').toDate(),
        endDate: moment().subtract(1, 'day').toDate(),
        message: 'Family emergency, need immediate leave',
        empStatus: 'Approved',
        casualLeave: 10,
        sickLeave: 10,
        totalLeaves: 21,
        createdAt: moment().subtract(2, 'days').toDate()
      },
      {
        _id: '4',
        empId: { _id: '4', empName: 'Sarah Wilson', empEmail: 'sarah.wilson@company.com' },
        leaveType: 'Casual Leave',
        startDate: moment().add(7, 'days').toDate(),
        endDate: moment().add(9, 'days').toDate(),
        message: 'Planning a short vacation',
        empStatus: 'Rejected',
        casualLeave: 7,
        sickLeave: 10,
        totalLeaves: 22,
        createdAt: moment().subtract(3, 'days').toDate()
      }
    ];
    setLeaveRequests(sampleRequests);
  };

  const handleLeaveAction = async (leaveId, action, comments = '') => {
    try {
      const response = await adminAPI.updateLeaveStatus(leaveId, {
        empStatus: action,
        comments: comments,
        isActive: true
      });

      if (response.data.success) {
        toast.success(`Leave request ${action.toLowerCase()} successfully`);
        fetchLeaveRequests(); // Refresh the list
      } else {
        // Update local state for demo
        setLeaveRequests(prev => 
          prev.map(leave => 
            leave._id === leaveId 
              ? { ...leave, empStatus: action }
              : leave
          )
        );
        toast.success(`Leave request ${action.toLowerCase()} successfully`);
      }
    } catch (error) {
      // Fallback for demo - update local state
      setLeaveRequests(prev => 
        prev.map(leave => 
          leave._id === leaveId 
            ? { ...leave, empStatus: action }
            : leave
        )
      );
      toast.success(`Leave request ${action.toLowerCase()} successfully`);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'Approved':
        return <Badge bg="success">Approved</Badge>;
      case 'Rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getLeaveTypeBadge = (type) => {
    const colors = {
      'Casual Leave': 'primary',
      'Sick Leave': 'info',
      'Emergency Leave': 'danger',
      'Maternity Leave': 'success',
      'Paternity Leave': 'dark'
    };
    return <Badge bg={colors[type] || 'secondary'}>{type}</Badge>;
  };

  const calculateLeaveDays = (startDate, endDate) => {
    return moment(endDate).diff(moment(startDate), 'days') + 1;
  };

  const showLeaveDetails = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filter === 'All') return true;
    return request.empStatus === filter;
  });

  return (
    <div className="fade-in">
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Leave Requests Management
              </h4>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        No leave requests found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((leave) => (
                    <tr key={leave._id}>
                      <td>
                        <div>
                          <strong>{leave.empId?.empName}</strong>
                          <br />
                          <small className="text-muted">
                            {leave.empId?.empEmail}
                          </small>
                        </div>
                      </td>
                      <td>{getLeaveTypeBadge(leave.leaveType)}</td>
                      <td>
                        <div>
                          <small>
                            {moment(leave.startDate).format('MMM DD')} - {moment(leave.endDate).format('MMM DD, YYYY')}
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong>{calculateLeaveDays(leave.startDate, leave.endDate)}</strong> days
                      </td>
                      <td>{getStatusBadge(leave.empStatus)}</td>
                      <td>
                        {moment(leave.createdAt).format('MMM DD, YYYY')}
                        <br />
                        <small className="text-muted">
                          {moment(leave.createdAt).fromNow()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => showLeaveDetails(leave)}
                          >
                            <FaEye />
                          </Button>
                          {leave.empStatus === 'Pending' && (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleLeaveAction(leave._id, 'Approved')}
                              >
                                <FaCheck />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleLeaveAction(leave._id, 'Rejected')}
                              >
                                <FaTimes />
                              </Button>
                            </>
                          )}
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

      {/* Leave Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Leave Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <Row>
              <Col md={6}>
                <h6>Employee Information</h6>
                <p><strong>Name:</strong> {selectedLeave.empId?.empName}</p>
                <p><strong>Email:</strong> {selectedLeave.empId?.empEmail}</p>
                <p><strong>Employee ID:</strong> {selectedLeave.empId?._id?.slice(-8).toUpperCase()}</p>
              </Col>
              <Col md={6}>
                <h6>Leave Balance</h6>
                <p><strong>Casual Leave:</strong> {selectedLeave.casualLeave} days</p>
                <p><strong>Sick Leave:</strong> {selectedLeave.sickLeave} days</p>
                <p><strong>Total Leaves:</strong> {selectedLeave.totalLeaves} days</p>
              </Col>
              <Col xs={12}>
                <hr />
                <h6>Leave Details</h6>
                <Row>
                  <Col md={4}>
                    <p><strong>Type:</strong> {getLeaveTypeBadge(selectedLeave.leaveType)}</p>
                  </Col>
                  <Col md={4}>
                    <p><strong>Status:</strong> {getStatusBadge(selectedLeave.empStatus)}</p>
                  </Col>
                  <Col md={4}>
                    <p><strong>Duration:</strong> {calculateLeaveDays(selectedLeave.startDate, selectedLeave.endDate)} days</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <p><strong>Start Date:</strong> {moment(selectedLeave.startDate).format('MMMM DD, YYYY')}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>End Date:</strong> {moment(selectedLeave.endDate).format('MMMM DD, YYYY')}</p>
                  </Col>
                </Row>
                <p><strong>Reason:</strong></p>
                <p className="text-muted">{selectedLeave.message}</p>
                <p><strong>Applied On:</strong> {moment(selectedLeave.createdAt).format('MMMM DD, YYYY [at] HH:mm')}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedLeave?.empStatus === 'Pending' && (
            <>
              <Button
                variant="success"
                onClick={() => handleLeaveAction(selectedLeave._id, 'Approved')}
              >
                <FaCheck className="me-2" />
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => handleLeaveAction(selectedLeave._id, 'Rejected')}
              >
                <FaTimes className="me-2" />
                Reject
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveRequests;
