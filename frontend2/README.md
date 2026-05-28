# Frontend - MERN Realtime Task Manager

React + Vite frontend for the realtime task management assignment.

## Features

- React functional components and hooks
- Signup and login screens
- JWT stored in `localStorage`
- Axios API client with auth header interceptor
- Redux Toolkit auth and task state
- Shared realtime task board with Socket.IO
- Create tasks
- Edit task title, description, and status
- Delete tasks
- Toggle task status between Pending and Completed
- Display who created each task
- Display who last updated each task
- Search, status filter, and pagination
- Responsive UI with light/dark theme
- Client-side form validation and toast feedback
- Clear inline signup validation and server error display
- Vitest and Testing Library tests

## Setup

```powershell
cd frontend2
npm install
```

## Run

Start the backend first from `backend/`, then run:

```powershell
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173
```

## Test

```powershell
npm test
```

Current tests cover auth form rendering, task form rendering, task card edit controls, and duplicate-safe realtime task updates.

## Build

```powershell
npm run build
```

## API Configuration

The API base URL is configured in:

```text
src/api/axios.js
```

Default:

```js
baseURL: "http://localhost:5000/api"
```

The Socket.IO client connects to:

```js
io("http://localhost:5000", { auth: { token } })
```

## Important Files

- `src/main.jsx` - React bootstrap and Redux provider
- `src/app.jsx` - routes
- `src/api/axios.js` - Axios client
- `src/store/slices/authSlice.js` - auth state and async actions
- `src/store/slices/taskSlice.js` - task state, realtime upsert/delete logic
- `src/pages/Dashboard.jsx` - task board and Socket.IO listeners
- `src/components/TaskForm.jsx` - create task form
- `src/components/TaskCard.jsx` - created-by, updated-by, edit, delete, and status controls
- `src/styles/global.css` - responsive UI styling

## Assignment Checklist

- React.js frontend: implemented
- Functional components and hooks: implemented
- Signup/login screens: implemented
- Task create/edit/delete/view/status update: implemented
- Created by / last updated by display: implemented
- Real-time UI updates: implemented with Socket.IO
- Proper form validation: implemented
- Clean responsive UI: implemented
- Tests: implemented
