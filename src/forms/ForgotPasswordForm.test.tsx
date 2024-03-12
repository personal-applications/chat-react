import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ServerError } from "../services/error";
import ForgotPasswordForm from "./ForgotPasswordForm";

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

  await userEvent.type(emailInput, "invalid-email");
  await userEvent.click(submitButton);

  expect(screen.getByText("Invalid email format.")).toBeInTheDocument();
});

test("displays success message on successful submission", async () => {
  mockOnSubmit.mockResolvedValueOnce({ message: "Password reset email sent" });

  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const submitButton = screen.getByRole("button", { name: "Forgot" });

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.click(submitButton);

  expect(screen.getByText("Password reset email sent")).toBeInTheDocument();
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

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.click(submitButton);

  expect(screen.getByText("An unknown error occurred.")).toBeInTheDocument();
});
