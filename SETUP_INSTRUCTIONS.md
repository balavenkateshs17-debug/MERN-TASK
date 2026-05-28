# 🚀 Setup Instructions for New Developers

This guide will help you get the Task Manager application running on your local machine.

## Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** v4.4+ ([Download](https://www.mongodb.com/try/download/community))
- **Git**
- A code editor (VS Code recommended)

## Complete Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

### Step 2: Backend Configuration

```bash
cd backend

# Install all dependencies
npm install
```

**Create Environment File:**

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

**Update these values in `.env`:**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=generate_a_random_secure_key_here
CORS_ORIGIN=http://localhost:5173
```

**To generate a secure JWT_SECRET:**

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Step 3: MongoDB Setup

**Option A: Using System MongoDB**

```bash
# Start MongoDB service
# macOS (with Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongodb

# Windows (Command Prompt as Admin)
net start MongoDB
```

**Option B: Using MongoDB Directly**

```bash
# Create data directory
mkdir ~/mongodb_data

# Start MongoDB
mongod --dbpath ~/mongodb_data --port 27017
```

Verify MongoDB is running:

```bash
mongo # or mongosh
# You should see the MongoDB shell prompt
exit
```

### Step 4: Frontend Configuration

```bash
cd ../frontend2

# Install dependencies
npm install
```

**Create Environment File:**

```bash
# Copy the example file
cp .env.example .env

# Usually no changes needed for local development
# But you can customize if your backend is on different URL
```

Default values in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## ▶️ Running the Application

### Terminal 1: Start Backend

```bash
cd backend
npm start
```

Expected output:

```
Server running on port 5000
MongoDB Connected
```

### Terminal 2: Start Frontend

```bash
cd frontend2
npm run dev
```

Expected output:

```
VITE v5.4.10  ready in 95 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Terminal 3 (Optional): Start MongoDB (if not running as service)

```bash
mongod --dbpath ~/mongodb_data --port 27017
```

### Open in Browser

Navigate to: **http://localhost:5173**

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend2
npm test
```

## 📝 Test Credentials

You can use these credentials after signing up:

```
Email: test@example.com
Password: password123
```

Or signup with your own credentials.

## 🔍 Common Issues & Solutions

### Issue: MongoDB Connection Refused

**Solution:**

```bash
# Check if MongoDB is running
ps aux | grep mongod

# If not running, start it
mongod --dbpath ~/mongodb_data --port 27017

# Or use system service
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

### Issue: Port 5000 Already in Use

**Solution:**

```bash
# Change port in backend/.env
PORT=5001

# Or kill process on port 5000
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: Port 5173 Already in Use

Vite will automatically use the next available port (usually 5174).

### Issue: CORS Error Between Frontend and Backend

**Solution:**

1. Ensure backend is running on correct port
2. Check `VITE_API_BASE_URL` in frontend `.env`
3. Verify `CORS_ORIGIN` in backend `.env` matches frontend URL

### Issue: Socket.IO Not Connecting

**Solution:**

1. Check `VITE_SOCKET_URL` in frontend `.env`
2. Ensure backend is running
3. Verify you have a valid JWT token
4. Check browser console for error messages

### Issue: npm install Fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📦 Project Structure Quick Reference

```
task-manager/
├── backend/              # Express.js server
│   ├── .env             # Environment variables (create from .env.example)
│   ├── .env.example     # Template for environment variables
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   └── server.js        # Entry point
│
├── frontend2/           # React + Vite app
│   ├── .env            # Environment variables (create from .env.example)
│   ├── .env.example    # Template for environment variables
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── store/      # Redux state
│   │   └── api/        # API client
│   └── index.html      # Entry point
│
└── README.md           # Main documentation
```

## 🚀 Next Steps

1. **Explore the App**: Create some tasks, test real-time updates
2. **Review Code**: Check `backend/README.md` and `frontend2/README.md`
3. **Run Tests**: Ensure everything works with `npm test`
4. **Customize**: Add your own features!

## 💡 Development Tips

- **Hot Reload**: Both backend (with nodemon) and frontend (Vite) reload automatically
- **API Testing**: Use Postman or curl to test API endpoints
- **Browser DevTools**: Open DevTools (F12) to inspect Network and Console

## 📚 Useful Commands

```bash
# Start backend with hot reload
npm run server  # In backend/ directory

# Lint code
npm run lint    # In frontend/ or backend/ directory

# Build frontend for production
npm run build   # In frontend/ directory

# View API documentation
# Browser: http://localhost:5000
```

## 🆘 Need Help?

1. Check GitHub Issues
2. Review API docs in main README
3. Check browser console for error messages
4. Check backend server logs

---

**Happy coding! 🎉**
