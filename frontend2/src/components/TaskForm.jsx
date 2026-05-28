import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../store/slices/taskSlice";
import toast from "react-hot-toast";

function TaskForm() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // simple validation
    if (!task.title || task.title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    try {
      const resultAction = await dispatch(createTask(task));

      if (createTask.fulfilled.match(resultAction)) {
        toast.success("Task Created");

        setTask({
          title: "",
          description: "",
          status: "Pending",
        });
      } else {
        throw new Error(resultAction.payload || "Create failed");
      }
    } catch (error) {
      toast.error(error.message || "Error creating task");
    }
  };

  return (
    <div className="task-form">
      <h2>Create Task</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={task.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={task.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={task.status}
          onChange={handleChange}
        >
          <option>Pending</option>
          <option>Completed</option>
        </select>

        <button className="btn" disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
