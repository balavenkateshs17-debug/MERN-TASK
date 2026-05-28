import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "../store/slices/taskSlice";
import toast from "react-hot-toast";

const getUserLabel = (user) => {
  if (!user) return "Unknown user";
  if (typeof user === "string") return "Unknown user";
  return user.name || user.email || "Unknown user";
};

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "Pending",
  });

  useEffect(() => {
    if (!editing) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Pending",
      });
    }
  }, [editing, task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const result = await dispatch(deleteTask(task._id));

      if (deleteTask.fulfilled.match(result)) {
        toast.success("Task Deleted");
      } else {
        throw new Error(result.payload || "Delete failed");
      }
    } catch (error) {
      toast.error(error.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const newStatus =
        task.status === "Pending" ? "Completed" : "Pending";

      const result = await dispatch(
        updateTask({ id: task._id, updates: { status: newStatus } })
      );

      if (updateTask.fulfilled.match(result)) {
        toast.success("Status Updated");
      } else {
        throw new Error(result.payload || "Update failed");
      }
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (loading) return;

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    try {
      setLoading(true);

      const result = await dispatch(
        updateTask({
          id: task._id,
          updates: {
            title,
            description,
            status: formData.status,
          },
        })
      );

      if (updateTask.fulfilled.match(result)) {
        toast.success("Task Updated");
        setEditing(false);
      } else {
        throw new Error(result.payload || "Update failed");
      }
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-card">
      {editing ? (
        <form className="edit-task-form" onSubmit={handleSave}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <div className="actions">
            <button className="save-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              className="edit-btn"
              type="button"
              disabled={loading}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3>{task.title}</h3>

          <p>{task.description || "No description added."}</p>

          <span className={`status ${task.status === "Pending" ? "pending" : "completed"}`}>
            {task.status}
          </span>

          <div className="task-meta">
            <span>Created by {getUserLabel(task.createdBy)}</span>
            <span>Last updated by {getUserLabel(task.updatedBy || task.createdBy)}</span>
          </div>

          <div className="actions">
            <button
              className="edit-btn"
              type="button"
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              Edit
            </button>

            <button className="edit-btn" type="button" onClick={toggleStatus} disabled={loading}>
              {loading ? "..." : task.status === "Pending" ? "Mark Done" : "Reopen"}
            </button>

            <button className="delete-btn" type="button" onClick={handleDelete} disabled={loading}>
              {loading ? "..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;
