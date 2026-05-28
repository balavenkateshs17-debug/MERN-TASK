import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../../store/store";
import LoginForm from "../LoginForm";

describe("LoginForm", () => {
  it("renders login inputs", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <LoginForm />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });
});
