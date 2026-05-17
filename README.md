# TeamFlow – Team Task Manager

A full-stack team collaboration and task management platform where users can create projects, assign tasks, manage teams, track progress, and collaborate in real time with role-based access control.

## Live Demo

Frontend: https://task-manager-application-3f3bjeyfx.vercel.app/

Backend API: https://task-manager-application-dyg4.onrender.com

Demo Video: 

GitHub Repository: https://github.com/Mrinnovater/task_manager_application

---

## Features

### Authentication & Security
- User Registration and Login
- JWT Authentication
- Forgot Password & Reset Password via Email
- Password Encryption using bcrypt
- Protected Routes
- Role-Based Access Control (Admin / Member)

### Project Management
- Create Projects
- View Project Details
- Assign Team Members
- Track Project Progress

### Task Management
- Create Tasks
- Assign Tasks to Users
- Update Task Status
- Task Priorities
- Due Dates
- Overdue Tracking

### Dashboard
- Task Analytics
- Project Statistics
- Status Tracking
- Overdue Task Monitoring

### User Profile
- Profile Update
- Avatar Upload
- Role Display
- Persistent User Settings

### Collaboration Features
- Comments System
- Notifications
- Real-time Chat using Socket.IO

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React Icons
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Socket.IO
- Nodemailer

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```bash
team-taskflow/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── api/
│   │   └── routes/
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── uploads/
│   └── server.js
│
└── README.md
```

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Mrinnovater/task_manager_application.git
```

Move into project directory:

```bash
cd task_manager_application
```

---

### Frontend Setup

Move to client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

---

### Backend Setup

Move to server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

EMAIL_USER=YOUR_EMAIL

EMAIL_PASS=YOUR_APP_PASSWORD

CLIENT_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| GET | /api/auth/me | Get Current User |
| PUT | /api/auth/profile | Update Profile |
| POST | /api/auth/forgot-password | Send Reset Link |
| POST | /api/auth/reset-password/:token | Reset Password |

### Projects

| Method | Endpoint |
|----------|----------|
| GET | /api/projects |
| POST | /api/projects |
| PUT | /api/projects/:id |
| DELETE | /api/projects/:id |

### Tasks

| Method | Endpoint |
|----------|----------|
| GET | /api/tasks |
| POST | /api/tasks |
| PUT | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## Screenshots

Add screenshots here:

- Login Page
- Dashboard
- Projects Page
- Tasks Page
- Settings Page
- Analytics Page

---

## Future Improvements

- Cloudinary Image Storage
- Team Video Meetings
- Drag & Drop Task Scheduling
- Calendar Integration
- Advanced Analytics
- Dark/Light Theme Toggle

---

## Author

**Venkata Shiva Sri Ch**

Email: shivamchodisetty333@gmail.com

GitHub: https://github.com/Mrinnovater

LinkedIn: https://www.linkedin.com/in/ch-venkata-shiva-sri-976245296/

---

## License

This project is developed for educational and assessment purposes.
