import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../../store/store";
import SignupForm from "../SignupForm";

describe("SignupForm", () => {
  it("shows clear inline validation errors", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <SignupForm />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Signup/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("Please fix the highlighted fields.");
    expect(screen.getByText("Name must be at least 2 characters.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
  });
});
