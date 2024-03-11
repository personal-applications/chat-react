import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { ServerError } from "../services/error";

const mockOnSubmit = vi.fn();

const renderForm = () => {
  render(
    <BrowserRouter>
      <ForgotPasswordForm onSubmit={mockOnSubmit} />
    </BrowserRouter>,
  );
};

test("renders form correctly", () => {
  renderForm();

  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Forgot" })).toBeInTheDocument();
});

test("displays error message for invalid email", async () => {
  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const submitButton = screen.getByRole("button", { name: "Forgot" });

  fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("Invalid email format.")).toBeInTheDocument();
  });
});

test("displays success message on successful submission", async () => {
  mockOnSubmit.mockResolvedValueOnce({ message: "Password reset email sent" });

  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const submitButton = screen.getByRole("button", { name: "Forgot" });

  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("Password reset email sent")).toBeInTheDocument();
  });
});

test("displays error message on server error", async () => {
  const e: ServerError = {
    code: 500,
    errors: [],
    message: "Server error",
    status: "error",
  };
  mockOnSubmit.mockRejectedValueOnce(e);

  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const submitButton = screen.getByRole("button", { name: "Forgot" });

  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("An unknown error occurred.")).toBeInTheDocument();
  });
});
