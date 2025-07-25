import React, { useState } from 'react';
import { Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
import { leaveAPI } from '../../services/api';
import { FaCalendarAlt, FaPaperPlane } from 'react-icons/fa';

const LeaveApplication = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateLeaveDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = moment(formData.startDate);
      const end = moment(formData.endDate);
      const days = end.diff(start, 'days') + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      setLoading(false);
      return;
    }

    if (moment(formData.startDate).isAfter(moment(formData.endDate))) {
      setError('Start date cannot be after end date');
      setLoading(false);
      return;
    }

    if (moment(formData.startDate).isBefore(moment(), 'day')) {
      setError('Cannot apply for past dates');
      setLoading(false);
      return;
    }

    try {
      const leaveData = {
        ...formData,
        startDate: moment(formData.startDate).toISOString(),
        endDate: moment(formData.endDate).toISOString(),
        isActive: true
      };

      const response = await leaveAPI.applyLeave(user._id, leaveData);

      if (response.data.success) {
        toast.success('Leave application submitted successfully!');
        setFormData({
          leaveType: 'Casual Leave',
          startDate: '',
          endDate: '',
          message: ''
        });
      } else {
        setError(response.data.message || 'Failed to submit leave application');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit leave application';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const leaveDays = calculateLeaveDays();

  return (
    <div className="fade-in">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header>
              <h4 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Apply for Leave
              </h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Leave Type</Form.Label>
                      <Form.Select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        required
                      >
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Emergency Leave">Emergency Leave</option>
                        <option value="Maternity Leave">Maternity Leave</option>
                        <option value="Paternity Leave">Paternity Leave</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {leaveDays > 0 && (
                      <div className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <div className="form-control-plaintext">
                          <strong className="text-primary">
                            {leaveDays} day{leaveDays > 1 ? 's' : ''}
                          </strong>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={moment().format('YYYY-MM-DD')}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || moment().format('YYYY-MM-DD')}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Reason for Leave</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please provide a reason for your leave request..."
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    <FaPaperPlane className="me-2" />
                    {loading ? 'Submitting...' : 'Submit Leave Application'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Body>
              <h5>Leave Balance Summary</h5>
              <Row className="text-center">
                <Col md={4}>
                  <div className="p-3 bg-light rounded">
                    <h4 className="text-success">10</h4>
                    <small>Casual Leave</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 bg-light rounded">
                    <h4 className="text-info">10</h4>
                    <small>Sick Leave</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 bg-light rounded">
                    <h4 className="text-primary">22</h4>
                    <small>Total Leaves</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LeaveApplication;
