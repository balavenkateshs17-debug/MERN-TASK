import TaskCard from "./TaskCard";

function TaskList({ tasks }) {
  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
        />
      ))}
    </div>
  );
}

export default TaskList;