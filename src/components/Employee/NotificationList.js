import React, { useState, useEffect } from 'react';
import { Card, Alert, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { employeeAPI } from '../../services/api';
import { FaBell, FaInfoCircle } from 'react-icons/fa';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await employeeAPI.getNotifications();
      
      if (response.data.success) {
        setNotifications(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notifications';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'urgent':
      case 'important':
        return <FaInfoCircle className="text-danger" />;
      case 'info':
      case 'general':
        return <FaInfoCircle className="text-info" />;
      default:
        return <FaBell className="text-primary" />;
    }
  };

  const getNotificationVariant = (type) => {
    switch (type?.toLowerCase()) {
      case 'urgent':
        return 'danger';
      case 'important':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Card>
        <Card.Header>
          <h4 className="mb-0">
            <FaBell className="me-2" />
            Notifications & Announcements
          </h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {notifications.length === 0 ? (
            <div className="text-center py-5">
              <FaBell size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No notifications</h5>
              <p className="text-muted">
                You're all caught up! No new notifications at this time.
              </p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification, index) => (
                <Card key={notification._id || index} className="mb-3 border-start border-4 border-primary">
                  <Card.Body>
                    <Row>
                      <Col xs={1} className="text-center">
                        {getNotificationIcon(notification.type)}
                      </Col>
                      <Col xs={11}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1">
                            {notification.noticeTitle || 'Notification'}
                          </h6>
                          <div>
                            <Badge 
                              bg={getNotificationVariant(notification.type)} 
                              className="me-2"
                            >
                              {notification.type || 'General'}
                            </Badge>
                            <small className="text-muted">
                              {notification.createdAt 
                                ? moment(notification.createdAt).fromNow()
                                : moment().fromNow()
                              }
                            </small>
                          </div>
                        </div>
                        <p className="mb-0 text-muted">
                          {notification.noticeMessage || 'No message content available.'}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {/* Sample notifications for demo purposes if no real notifications */}
          {notifications.length === 0 && !error && (
            <div className="mt-4">
              <h6 className="text-muted mb-3">Sample Notifications:</h6>
              
              <Card className="mb-3 border-start border-4 border-info">
                <Card.Body>
                  <Row>
                    <Col xs={1} className="text-center">
                      <FaInfoCircle className="text-info" />
                    </Col>
                    <Col xs={11}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-1">System Maintenance</h6>
                        <div>
                          <Badge bg="info" className="me-2">Info</Badge>
                          <small className="text-muted">2 hours ago</small>
                        </div>
                      </div>
                      <p className="mb-0 text-muted">
                        Scheduled system maintenance will occur this weekend. Please save your work regularly.
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3 border-start border-4 border-success">
                <Card.Body>
                  <Row>
                    <Col xs={1} className="text-center">
                      <FaBell className="text-success" />
                    </Col>
                    <Col xs={11}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-1">New Policy Update</h6>
                        <div>
                          <Badge bg="success" className="me-2">General</Badge>
                          <small className="text-muted">1 day ago</small>
                        </div>
                      </div>
                      <p className="mb-0 text-muted">
                        Please review the updated work from home policy in the employee handbook.
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3 border-start border-4 border-warning">
                <Card.Body>
                  <Row>
                    <Col xs={1} className="text-center">
                      <FaInfoCircle className="text-warning" />
                    </Col>
                    <Col xs={11}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-1">Holiday Reminder</h6>
                        <div>
                          <Badge bg="warning" className="me-2">Important</Badge>
                          <small className="text-muted">3 days ago</small>
                        </div>
                      </div>
                      <p className="mb-0 text-muted">
                        Don't forget to submit your timesheet before the upcoming holiday.
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotificationList;
