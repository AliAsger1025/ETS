import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employeeAPI } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await employeeAPI.sendResetEmail(email);

      if (response.data.success) {
        setSuccess(true);
        toast.success('Password reset email sent successfully!');
      } else {
        setError(response.data.message || 'Failed to send reset email');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card style={{ width: '100%', maxWidth: '400px' }}>
          <Card.Body className="p-4 text-center">
            <h2 className="mb-4">Check Your Email</h2>
            <Alert variant="success">
              We've sent a password reset link to <strong>{email}</strong>
            </Alert>
            <p>Please check your email and click the link to reset your password.</p>
            <Link to="/login" className="btn btn-primary">
              Back to Login
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Forgot Password</h2>
          <p className="text-center text-muted mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form>

          <div className="text-center">
            <Link to="/login">
              Remember your password? Login here
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
