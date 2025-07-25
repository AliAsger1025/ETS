import React, { useState } from 'react';
import { Row, Col, Form, Button, Card, Alert, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { employeeAPI } from '../../services/api';
import { FaUser, FaCamera, FaSave } from 'react-icons/fa';

const ProfileSettings = () => {
  const { user, login, token } = useAuth();
  const [formData, setFormData] = useState({
    empName: user?.empName || '',
    empEmail: user?.empEmail || '',
    empCity: user?.empCity || '',
    empAddress: user?.empAddress || '',
    empPhoneNo: user?.empPhoneNo || '',
    empGender: user?.empGender || 'Male',
    empTechnologies: user?.empTechnologies || 'nodejs'
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.empProfilePic || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append profile picture if selected
      if (profilePic) {
        formDataToSend.append('empProfilePic', profilePic);
      }

      const response = await employeeAPI.updateEmployee(user._id, formDataToSend);

      if (response.data.success) {
        // Update user data in context
        const updatedUser = { ...user, ...formData };
        if (response.data.data?.empProfilePic) {
          updatedUser.empProfilePic = response.data.data.empProfilePic;
        }
        login(updatedUser, token);
        
        toast.success('Profile updated successfully!');
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header>
              <h4 className="mb-0">
                <FaUser className="me-2" />
                Profile Settings
              </h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Profile Picture Section */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <Image
                      src={previewUrl || (user?.empGender === 'Female' ? '/uploads/female.png' : '/uploads/male.png')}
                      alt="Profile"
                      className="profile-picture"
                      onError={(e) => {
                        e.target.src = user?.empGender === 'Female' ? '/uploads/female.png' : '/uploads/male.png';
                      }}
                    />
                    <label 
                      htmlFor="profilePicInput" 
                      className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle"
                      style={{ width: '35px', height: '35px' }}
                    >
                      <FaCamera />
                    </label>
                    <Form.Control
                      id="profilePicInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <p className="text-muted mt-2">Click the camera icon to change profile picture</p>
                </div>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="empName"
                        value={formData.empName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="empEmail"
                        value={formData.empEmail}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        disabled // Usually email shouldn't be editable
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="empPhoneNo"
                        value={formData.empPhoneNo}
                        onChange={handleChange}
                        required
                        placeholder="Enter phone number"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="empGender"
                        value={formData.empGender}
                        onChange={handleChange}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="empCity"
                        value={formData.empCity}
                        onChange={handleChange}
                        required
                        placeholder="Enter your city"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Technologies</Form.Label>
                      <Form.Select
                        name="empTechnologies"
                        value={formData.empTechnologies}
                        onChange={handleChange}
                        required
                      >
                        <option value="nodejs">Node.js</option>
                        <option value="react">React</option>
                        <option value="angular">Angular</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="php">PHP</option>
                        <option value="dotnet">.NET</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="empAddress"
                    value={formData.empAddress}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full address"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    <FaSave className="me-2" />
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Employee Info Display */}
          <Card className="mt-4">
            <Card.Body>
              <h5>Employee Information</h5>
              <Row>
                <Col md={6}>
                  <p><strong>Employee ID:</strong> {user?._id?.slice(-8).toUpperCase()}</p>
                  <p><strong>Role:</strong> {user?.empRole || 'Employee'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`badge ms-2 ${user?.empWorkingStatus === 'Working' ? 'bg-success' : 'bg-warning'}`}>
                      {user?.empWorkingStatus || 'Active'}
                    </span>
                  </p>
                </Col>
                <Col md={6}>
                  <p><strong>Join Date:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Department:</strong> Technology</p>
                  <p><strong>Manager:</strong> HR Department</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileSettings;
