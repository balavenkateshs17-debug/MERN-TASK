# MERN Realtime Task Manager

A modern, full-stack task management application with real-time updates using React, Express, MongoDB, and Socket.IO.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Real-time Updates**: Instant task creation, updates, and deletion across all connected users via Socket.IO
- **Task Management**: Create, read, update, delete tasks with title, description, and status
- **Search & Filter**: Filter tasks by status and search by title/description
- **Pagination**: Efficient task list pagination
- **User Attribution**: See who created and last updated each task
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Form Validation**: Client-side and server-side validation with user feedback

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16.0.0 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and update values if needed
# - PORT: Express server port (default: 5000)
# - MONGO_URI: MongoDB connection string
# - JWT_SECRET: Secure random key for JWT (generate your own!)
# - CORS_ORIGIN: Frontend URL for CORS (default: http://localhost:5173)
```

### 3. Frontend Setup

```bash
cd ../frontend2

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env if deploying to different server
# - VITE_API_BASE_URL: Backend API URL
# - VITE_SOCKET_URL: Backend Socket.IO URL
```

## ▶️ Running the Application

### Start MongoDB

**On Linux/Mac with systemctl:**

```bash
sudo systemctl start mongodb
```

**Or run mongod directly:**

```bash
mongod --dbpath ~/mongodb_data --port 27017 --nounixsocket
```

### Start Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:5000` (or configured PORT)

### Start Frontend Development Server

```bash
cd frontend2
npm run dev
```

The frontend will run on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Tests include:

- Authentication (signup, login)
- Task CRUD operations
- Pagination and filtering
- Socket.IO real-time updates

### Frontend Tests

```bash
cd frontend2
npm test
```

## 📚 API Documentation

### Authentication Endpoints

**Signup**

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response: `201 Created`

```json
{
  "message": "Signup Successful",
  "token": "eyJhbGc..."
}
```

**Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response: `200 OK`

```json
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGc..."
}
```

### Task Endpoints

All task endpoints require `Authorization: Bearer <token>` header

**Get Tasks**

```http
GET /api/tasks?page=1&limit=10&search=task&status=Pending
Authorization: Bearer <token>
```

Response: `200 OK`

```json
{
  "tasks": [...],
  "page": 1,
  "limit": 10,
  "total": 50,
  "pages": 5
}
```

**Create Task**

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "status": "Pending"
}
```

Response: `201 Created`

**Update Task**

```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "Completed"
}
```

**Delete Task**

```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## 🔌 WebSocket Events (Socket.IO)

After connecting with a valid JWT, clients receive:

- `taskCreated`: When a new task is created
- `taskUpdated`: When a task is modified
- `taskDeleted`: When a task is removed

```javascript
const socket = io("http://localhost:5000", {
  auth: { token: "your-jwt-token" },
});

socket.on("taskCreated", (task) => {
  console.log("New task:", task);
});
```

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 📦 Project Structure

```
task-manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validateRequest.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── tests/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend2/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   ├── app.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables on your hosting platform
2. Ensure MongoDB Atlas or similar is accessible
3. Update `CORS_ORIGIN` to match frontend URL
4. Deploy with: `npm start`

### Frontend Deployment (Vercel/Netlify/GitHub Pages)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Update `.env` with production API URLs
4. Ensure backend CORS allows your deployment URL

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGO_URI` in .env
- Verify network access if using MongoDB Atlas

### Port Already in Use

- Backend: Change `PORT` in .env
- Frontend: Vite will use next available port (usually 5174)

### CORS Errors

- Ensure `CORS_ORIGIN` in backend .env matches frontend URL
- Check that API endpoints are correct in frontend `.env`

### Socket.IO Connection Failed

- Verify backend is running
- Check `VITE_SOCKET_URL` in frontend .env
- Ensure valid JWT token is being sent

## 📞 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using MERN Stack**
