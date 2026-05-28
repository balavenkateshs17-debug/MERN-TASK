# Backend - MERN Realtime Task Manager

Node.js, Express, MongoDB, JWT, and Socket.IO backend for the realtime task management assignment.

## Features

- User signup and login with hashed passwords
- JWT-protected task APIs
- Shared task board for all authenticated users
- Create, read, update, and delete task REST APIs
- Edit task title, description, and status through `PUT /api/tasks/:id`
- Task responses include `createdBy` and `updatedBy` user details
- Request validation with `express-validator`
- Central validation middleware
- Socket.IO realtime updates for logged-in users
- MongoDB schemas with Mongoose
- Jest, Supertest, Socket.IO, and mongodb-memory-server tests

## Realtime Behavior

Socket clients must connect with a JWT:

```js
const socket = io("http://localhost:5000", {
  auth: { token },
});
```

The server validates the token before accepting the socket. Authenticated sockets join the shared `tasks` room and receive:

- `taskCreated`
- `taskUpdated`
- `taskDeleted`

When any logged-in user creates, edits, deletes, or changes a task status, all other logged-in users receive the update instantly.

## Setup

```powershell
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=replace_with_a_secure_random_value
```

## Run

```powershell
npm start
```

Development with nodemon:

```powershell
npm run server
```

## Test

```powershell
npm test
```

Current coverage includes auth, validation, task CRUD, shared task visibility, pagination, and Socket.IO realtime delivery.

## API

All task routes require:

```http
Authorization: Bearer <jwt-token>
```

### Auth

`POST /api/auth/signup`

Body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password1!"
}
```

Success: `201`

```json
{
  "message": "Signup Successful",
  "token": "<jwt-token>"
}
```

`POST /api/auth/login`

Body:

```json
{
  "email": "test@example.com",
  "password": "Password1!"
}
```

Success: `200`

```json
{
  "message": "Login Successful",
  "token": "<jwt-token>"
}
```

Validation failures return `400` with:

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email must be valid" }
  ]
}
```

### Tasks

`GET /api/tasks`

Optional query params: `page`, `limit`, `search`, `status`.

`POST /api/tasks`

Body:

```json
{
  "title": "Build realtime UI",
  "description": "Use Socket.IO events",
  "status": "Pending"
}
```

Success responses include populated user details:

```json
{
  "_id": "6422f1c5e33d4f0012345678",
  "title": "Build realtime UI",
  "description": "Use Socket.IO events",
  "status": "Pending",
  "createdBy": {
    "_id": "6422f1c5e33d4f0012345677",
    "name": "Test User",
    "email": "test@example.com"
  },
  "updatedBy": {
    "_id": "6422f1c5e33d4f0012345677",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

`PUT /api/tasks/:id`

Body can include any of:

```json
{
  "title": "Updated title",
  "description": "Updated details",
  "status": "Completed"
}
```

The backend automatically sets `updatedBy` to the authenticated user who made the edit.

`DELETE /api/tasks/:id`

Returns:

```json
{
  "message": "Task Deleted"
}
```

## Assignment Checklist

- React frontend: implemented in `frontend2`
- Node/Express backend: implemented
- MongoDB with Mongoose schemas: implemented
- Signup/login/JWT auth: implemented
- Protected task REST APIs: implemented
- Create/edit/delete/view/status update: implemented
- Created by / last updated by tracking: implemented
- Realtime updates for logged-in users: implemented with Socket.IO
- Proper validation and error handling: implemented
- Tests: implemented
