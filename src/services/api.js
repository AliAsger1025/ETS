import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Employee API calls
export const employeeAPI = {
  // Create employee
  createEmployee: (employeeData) => {
    return api.post('/employee/create', employeeData);
  },

  // Employee login
  login: (credentials) => {
    return api.post('/employee/login', credentials);
  },

  // Admin login
  adminLogin: (credentials) => {
    return api.post('/admin/login', credentials);
  },

  // Send reset password email
  sendResetEmail: (email) => {
    return api.post('/employee/sendmail', { empEmail: email });
  },

  // Reset password
  resetPassword: (id, token, passwordData) => {
    return api.patch(`/employee/resetpassword/${id}/${token}`, passwordData);
  },

  // Forget password reset
  forgetPassword: (id, token, passwordData) => {
    return api.patch(`/employee/forgetpassword/${id}/${token}`, passwordData);
  },

  // Update employee data
  updateEmployee: (id, formData) => {
    return api.patch(`/employee/updateempdata/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get employee notifications
  getNotifications: () => {
    return api.get('/employee/empnotice');
  },
};

// Timesheet API calls
export const timesheetAPI = {
  // Clock in
  clockIn: (empId, clockData) => {
    return api.post(`/timesheet/clockin/${empId}`, clockData);
  },

  // Update attendance (clock out)
  updateAttendance: (empId, attendanceData) => {
    return api.patch(`/timesheet/empattendence/${empId}`, attendanceData);
  },
};

// Leave API calls
export const leaveAPI = {
  // Apply for leave
  applyLeave: (empId, leaveData) => {
    return api.post(`/leave/leaveapply/${empId}`, leaveData);
  },
};

// Admin API calls
export const adminAPI = {
  // Get all employee attendance
  getEmployeeAttendance: () => {
    return api.get('/admin/empattendance');
  },

  // Update leave status (approve/reject)
  updateLeaveStatus: (leaveId, statusData) => {
    return api.patch(`/admin/leavestatus/${leaveId}`, statusData);
  },
};

// Bench API calls
export const benchAPI = {
  // Get employee bench list
  getBenchList: (listData) => {
    return api.post('/bench/list', listData);
  },

  // Update employee status
  updateStatus: (statusData) => {
    return api.patch('/bench/update', statusData);
  },

  // Search employee
  searchEmployee: (letter) => {
    return api.post(`/bench/searchemployee/${letter}`);
  },
};

// Notice/Notification API calls
export const noticeAPI = {
  // Create notice
  createNotice: (adminId, noticeData) => {
    return api.post(`/notice/createnotice/${adminId}`, noticeData);
  },

  // Update notice
  updateNotice: (noticeId, noticeData) => {
    return api.patch(`/notice/updatenotice/${noticeId}`, noticeData);
  },

  // Delete notice
  deleteNotice: (noticeId) => {
    return api.delete(`/notice/deletenotice/${noticeId}`);
  },
};

export default api;
