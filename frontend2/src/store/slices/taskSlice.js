import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

const getTaskId = (task) => task?._id || task?.id;

const normalizeTasks = (tasks) => {
  if (!Array.isArray(tasks)) return [];

  const seen = new Set();

  return tasks.filter((task) => {
    const id = getTaskId(task);
    if (!id) return false;

    const key = String(id);
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const upsertTask = (items, task) => {
  const id = getTaskId(task);
  if (!id) return;

  const key = String(id);
  const existingIndex = items.findIndex((item) => String(getTaskId(item)) === key);

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      ...task,
    };
    return;
  }

  items.unshift(task);
};

const removeTask = (items, taskId) => {
  const key = String(taskId);
  return items.filter((task) => String(getTaskId(task)) !== key);
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/tasks");
      return normalizeTasks(Array.isArray(data) ? data : data.tasks);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/tasks", payload);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/tasks/${id}`,
        updates
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    taskCreated(state, action) {
      upsertTask(state.items, action.payload);
    },
    taskUpdated(state, action) {
      upsertTask(state.items, action.payload);
    },
    taskDeleted(state, action) {
      state.items = removeTask(state.items, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalizeTasks(action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        upsertTask(state.items, action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        upsertTask(state.items, action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = removeTask(state.items, action.payload);
      });
  },
});

export const { taskCreated, taskUpdated, taskDeleted } = taskSlice.actions;

export default taskSlice.reducer;
