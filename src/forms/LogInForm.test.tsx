import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LogInForm, { LoginFormFields } from "./LogInForm";

const mockOnSubmit = vi.fn();

const renderForm = () => {
  render(
    <BrowserRouter>
      <LogInForm onSubmit={mockOnSubmit} />
    </BrowserRouter>,
  );
};

test("renders form inputs and submit button", () => {
  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByRole("button", { name: "Log in" });

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test("submits form with valid data", async () => {
  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByRole("button", { name: "Log in" });

  const formData: LoginFormFields = {
    email: "test@example.com",
    password: "Password123",
  };

  fireEvent.change(emailInput, { target: { value: formData.email } });
  fireEvent.change(passwordInput, { target: { value: formData.password } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledWith(formData);
  });
});

test("displays error message for invalid email", async () => {
  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByRole("button", { name: "Log in" });

  const invalidEmail = "invalid-email";

  fireEvent.change(emailInput, { target: { value: invalidEmail } });
  fireEvent.change(passwordInput, { target: { value: "Password123" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    const emailError = screen.getByText("Invalid email format.");
    expect(emailError).toBeInTheDocument();
  });
});

test("displays error message for invalid password", async () => {
  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByRole("button", { name: "Log in" });

  const invalidPassword = "password";

  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: invalidPassword } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    const passwordError = screen.getByText(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    );
    expect(passwordError).toBeInTheDocument();
  });
});

test("displays error message on server error", async () => {
  mockOnSubmit.mockRejectedValueOnce(new Error("Server error"));

  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByRole("button", { name: "Log in" });

  const formData: LoginFormFields = {
    email: "test@example.com",
    password: "Password123",
  };

  fireEvent.change(emailInput, { target: { value: formData.email } });
  fireEvent.change(passwordInput, { target: { value: formData.password } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText("An unknown error occurred")).toBeInTheDocument();
  });
});

test("displays root error message on server error", async () => {
  const serverError = {
    code: 500,
    errors: [],
    message: "Server error",
    status: "error",
  };
  mockOnSubmit.mockRejectedValueOnce(serverError);

  renderForm();

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByRole("button", { name: "Log in" });

  const formData: LoginFormFields = {
    email: "test@example.com",
    password: "Password123",
  };

  fireEvent.change(emailInput, { target: { value: formData.email } });
  fireEvent.change(passwordInput, { target: { value: formData.password } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(serverError.message)).toBeInTheDocument();
  });
});
