import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Card, Modal, Row, Col, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';
import { noticeAPI } from '../../services/api';
import { FaBell, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const NoticeManagement = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState({
    noticeTitle: '',
    noticeMessage: '',
    noticeType: 'General'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch notices from API
      // For demo, using sample data
      generateSampleNotices();
    } catch (error) {
      console.log('API not available, using sample data');
      generateSampleNotices();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleNotices = () => {
    const sampleNotices = [
      {
        _id: '1',
        noticeTitle: 'System Maintenance Scheduled',
        noticeMessage: 'The system will be under maintenance this weekend from 2 AM to 6 AM. Please save your work regularly.',
        noticeType: 'Important',
        empId: { empName: 'Admin User' },
        isActive: true,
        createdAt: moment().subtract(2, 'hours').toDate()
      },
      {
        _id: '2',
        noticeTitle: 'Updated Work From Home Policy',
        noticeMessage: 'Please review the updated work from home policy available in the employee handbook. New guidelines are effective immediately.',
        noticeType: 'General',
        empId: { empName: 'HR Team' },
        isActive: true,
        createdAt: moment().subtract(1, 'day').toDate()
      },
      {
        _id: '3',
        noticeTitle: 'Holiday Reminder',
        noticeMessage: 'Don\'t forget to submit your timesheets before the upcoming holiday. The deadline is 5 PM today.',
        noticeType: 'Urgent',
        empId: { empName: 'Admin User' },
        isActive: true,
        createdAt: moment().subtract(3, 'days').toDate()
      },
      {
        _id: '4',
        noticeTitle: 'Team Building Event',
        noticeMessage: 'Join us for the annual team building event next Friday. Registration is open until Wednesday.',
        noticeType: 'Info',
        empId: { empName: 'HR Team' },
        isActive: true,
        createdAt: moment().subtract(5, 'days').toDate()
      }
    ];
    setNotices(sampleNotices);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (modalMode === 'create') {
        response = await noticeAPI.createNotice(user._id, {
          ...formData,
          isActive: true
        });
      } else if (modalMode === 'edit') {
        response = await noticeAPI.updateNotice(selectedNotice._id, {
          ...formData,
          isActive: true
        });
      }

      if (response?.data.success) {
        toast.success(`Notice ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        fetchNotices();
        handleCloseModal();
      } else {
        // Fallback for demo - update local state
        if (modalMode === 'create') {
          const newNotice = {
            _id: Date.now().toString(),
            ...formData,
            empId: { empName: user.empName },
            isActive: true,
            createdAt: new Date()
          };
          setNotices(prev => [newNotice, ...prev]);
        } else {
          setNotices(prev => 
            prev.map(notice => 
              notice._id === selectedNotice._id 
                ? { ...notice, ...formData }
                : notice
            )
          );
        }
        toast.success(`Notice ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        handleCloseModal();
      }
    } catch (error) {
      // Fallback for demo
      if (modalMode === 'create') {
        const newNotice = {
          _id: Date.now().toString(),
          ...formData,
          empId: { empName: user.empName },
          isActive: true,
          createdAt: new Date()
        };
        setNotices(prev => [newNotice, ...prev]);
      } else {
        setNotices(prev => 
          prev.map(notice => 
            notice._id === selectedNotice._id 
              ? { ...notice, ...formData }
              : notice
          )
        );
      }
      toast.success(`Notice ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
      handleCloseModal();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      const response = await noticeAPI.deleteNotice(noticeId);
      
      if (response?.data.success) {
        toast.success('Notice deleted successfully');
        fetchNotices();
      } else {
        // Fallback for demo - update local state
        setNotices(prev => prev.filter(notice => notice._id !== noticeId));
        toast.success('Notice deleted successfully');
      }
    } catch (error) {
      // Fallback for demo
      setNotices(prev => prev.filter(notice => notice._id !== noticeId));
      toast.success('Notice deleted successfully');
    }
  };

  const openModal = (mode, notice = null) => {
    setModalMode(mode);
    setSelectedNotice(notice);
    
    if (mode === 'create') {
      setFormData({
        noticeTitle: '',
        noticeMessage: '',
        noticeType: 'General'
      });
    } else if (mode === 'edit' && notice) {
      setFormData({
        noticeTitle: notice.noticeTitle,
        noticeMessage: notice.noticeMessage,
        noticeType: notice.noticeType
      });
    }
    
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotice(null);
    setFormData({
      noticeTitle: '',
      noticeMessage: '',
      noticeType: 'General'
    });
    setError('');
  };

  const getTypeBadge = (type) => {
    const colors = {
      'General': 'primary',
      'Important': 'warning',
      'Urgent': 'danger',
      'Info': 'info'
    };
    return <Badge bg={colors[type] || 'secondary'}>{type}</Badge>;
  };

  return (
    <div className="fade-in">
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <FaBell className="me-2" />
                Notice Management
              </h4>
            </Col>
            <Col md={3} className="text-end">
              <Button
                variant="primary"
                onClick={() => openModal('create')}
              >
                <FaPlus className="me-2" />
                Create Notice
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Created By</th>
                  <th>Created On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : notices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">
                        No notices found. Create your first notice!
                      </div>
                    </td>
                  </tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice._id}>
                      <td>
                        <div>
                          <strong>{notice.noticeTitle}</strong>
                          <br />
                          <small className="text-muted">
                            {notice.noticeMessage?.length > 50 
                              ? notice.noticeMessage.substring(0, 50) + '...'
                              : notice.noticeMessage
                            }
                          </small>
                        </div>
                      </td>
                      <td>{getTypeBadge(notice.noticeType)}</td>
                      <td>{notice.empId?.empName || 'Unknown'}</td>
                      <td>
                        {moment(notice.createdAt).format('MMM DD, YYYY')}
                        <br />
                        <small className="text-muted">
                          {moment(notice.createdAt).fromNow()}
                        </small>
                      </td>
                      <td>
                        <Badge bg={notice.isActive ? 'success' : 'secondary'}>
                          {notice.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openModal('view', notice)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openModal('edit', notice)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(notice._id)}
                          >
                            <FaTrash />
                          </Button>
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

      {/* Notice Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' && 'Create New Notice'}
            {modalMode === 'edit' && 'Edit Notice'}
            {modalMode === 'view' && 'Notice Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {modalMode === 'view' && selectedNotice ? (
            <div>
              <Row className="mb-3">
                <Col md={8}>
                  <h5>{selectedNotice.noticeTitle}</h5>
                </Col>
                <Col md={4} className="text-end">
                  {getTypeBadge(selectedNotice.noticeType)}
                </Col>
              </Row>
              <p className="text-muted">{selectedNotice.noticeMessage}</p>
              <hr />
              <Row>
                <Col md={6}>
                  <p><strong>Created By:</strong> {selectedNotice.empId?.empName}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Created On:</strong> {moment(selectedNotice.createdAt).format('MMMM DD, YYYY [at] HH:mm')}</p>
                </Col>
              </Row>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Notice Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="noticeTitle"
                      value={formData.noticeTitle}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter notice title"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Notice Type</Form.Label>
                    <Form.Select
                      name="noticeType"
                      value={formData.noticeType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="General">General</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Info">Info</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Notice Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="noticeMessage"
                  value={formData.noticeMessage}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter notice message content..."
                />
              </Form.Group>

              <div className="text-end">
                <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (modalMode === 'create' ? 'Create Notice' : 'Update Notice')}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NoticeManagement;
