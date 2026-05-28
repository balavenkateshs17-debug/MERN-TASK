const Task = require("../models/Task");

const userFields = "name email";

const emitTaskEvent = (req, event, payload) => {
  try {
    if (req.io?.to) {
      req.io.to("tasks").emit(event, payload);
      return;
    }

    req.io?.emit?.(event, payload);
  } catch (err) {
    console.log("Socket emit error:", err.message);
  }
};

const populateTaskUsers = async (task) => {
  if (!task || typeof task.populate !== "function") {
    return task;
  }

  await task.populate("createdBy", userFields);
  await task.populate("updatedBy", userFields);
  return task;
};

const buildTaskUpdates = (body, userId) => {
  const updates = { updatedBy: userId };

  ["title", "description", "status"].forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  return updates;
};

// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search?.trim();
    const status = req.query.status;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Task.countDocuments(filter);
    const pages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .populate("createdBy", userFields)
      .populate("updatedBy", userFields)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      tasks,
      page,
      limit,
      total,
      pages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } =
      req.body;

    const task = await Task.create({
      title,
      description,
      status,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    const populatedTask = await populateTaskUsers(task);

    emitTaskEvent(req, "taskCreated", populatedTask);

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      buildTaskUpdates(req.body, req.user.id),
      {
        new: true,
        runValidators: true,
      }
    );

    const populatedTask = await populateTaskUsers(updatedTask);

    emitTaskEvent(req, "taskUpdated", populatedTask);

    res.status(200).json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);

    emitTaskEvent(req, "taskDeleted", req.params.id);

    res.status(200).json({
      message: "Task Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
