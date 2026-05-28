import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../store/store";
import TaskCard from "../TaskCard";

const task = {
  _id: "task-1",
  title: "Write tests",
  description: "Cover edit controls",
  status: "Pending",
  createdBy: {
    name: "Asha",
    email: "asha@example.com",
  },
  updatedBy: {
    name: "Ravi",
    email: "ravi@example.com",
  },
};

describe("TaskCard", () => {
  it("shows who created and last updated the task", () => {
    render(
      <Provider store={store}>
        <TaskCard task={task} />
      </Provider>
    );

    expect(screen.getByText(/Created by Asha/i)).toBeInTheDocument();
    expect(screen.getByText(/Last updated by Ravi/i)).toBeInTheDocument();
  });

  it("shows edit fields for title, description, and status", () => {
    render(
      <Provider store={store}>
        <TaskCard task={task} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    expect(screen.getByDisplayValue("Write tests")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Cover edit controls")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pending")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });
});
