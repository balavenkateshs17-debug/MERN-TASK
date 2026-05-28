import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../store/store";
import TaskForm from "../TaskForm";

describe("TaskForm", () => {
  it("renders form inputs", () => {
    render(
      <Provider store={store}>
        <TaskForm />
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });
});
