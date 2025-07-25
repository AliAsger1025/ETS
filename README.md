# Employee Tracking System (ETS)

A comprehensive employee management system with both frontend and backend components.

## Project Structure

```
ETS/
├── frontend/           # React frontend application
│   ├── src/           # React source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js backend API
│   ├── employee_app/  # Employee modules
│   ├── config/        # Database configuration
│   ├── middlewares/   # Authentication & validation
│   ├── utils/         # Logging utilities
│   └── index.js       # Server entry point
└── README.md
```

## Features

### Frontend (React)
- 📊 Employee Dashboard
- 👤 Employee Registration & Management
- 📅 Leave Management System
- ⏰ Time Sheet Tracking
- 📱 Responsive Design with Tailwind CSS
- 🔐 JWT Authentication

### Backend (Node.js/Express)
- 🔌 RESTful API endpoints
- 🗄️ MongoDB database integration
- 🔒 JWT authentication & authorization
- 📧 Email notifications
- 📝 Comprehensive logging
- 🧪 API testing with Mocha/Chai

## Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling framework
- **JavaScript** - Programming language

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Winston** - Logging
- **Multer** - File uploads

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/AliAsger1025/ETS.git
cd ETS
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_tracking
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Employee Management
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Leave Management
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Submit leave request
- `PUT /api/leaves/:id` - Update leave status

### Time Tracking
- `GET /api/timesheets` - Get timesheets
- `POST /api/timesheets` - Create timesheet entry

## Usage

1. **Start the Backend**: Navigate to `/backend` and run `npm start`
2. **Start the Frontend**: Navigate to `/frontend` and run `npm start`
3. **Access the Application**: Open `http://localhost:3000` in your browser
4. **Register/Login**: Create an account or login with existing credentials
5. **Manage Employees**: Use the dashboard to manage employee data, leaves, and timesheets

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the GitHub repository.
