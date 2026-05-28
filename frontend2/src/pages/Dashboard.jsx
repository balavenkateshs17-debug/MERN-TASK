import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  taskCreated,
  taskUpdated,
  taskDeleted,
} from "../store/slices/taskSlice";

import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Pagination from "../components/Pagination";

function Dashboard() {
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector((state) => state.tasks);
  const token = useSelector((state) => state.auth.token);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // connect socket after token is available
  useEffect(() => {
    if (!token) return;

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const socket = io(socketUrl, {
      auth: { token },
    });

    socket.on("taskCreated", (newTask) => {
      dispatch(taskCreated(newTask));
    });

    socket.on("taskUpdated", (updatedTask) => {
      dispatch(taskUpdated(updatedTask));
    });

    socket.on("taskDeleted", (taskId) => {
      dispatch(taskDeleted(taskId));
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => socket.disconnect();
  }, [dispatch, token]);

  const filtered = useMemo(() => {
    let list = Array.isArray(tasks) ? tasks : [];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      list = list.filter((t) => t.status === statusFilter);
    }

    return list;
  }, [tasks, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        <div className="dashboard-layout">
          <TaskForm />

          <section className="tasks-panel">
            <div className="toolbar">
              <input
                className="search-input"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>

            {loading ? (
              <p className="loading-state">Loading tasks...</p>
            ) : paginated.length ? (
              <TaskList tasks={paginated} />
            ) : (
              <p className="empty-state">No tasks found.</p>
            )}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </section>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
