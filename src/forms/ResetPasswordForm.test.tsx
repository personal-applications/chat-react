import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ResetPasswordForm, { ResetPasswordFields } from "./ResetPasswordForm";
import { BrowserRouter } from "react-router-dom";

const mockOnSubmit = vi.fn();

const renderForm = () => {
  render(
    <BrowserRouter>
      <ResetPasswordForm onSubmit={mockOnSubmit} />
    </BrowserRouter>,
  );
};

test("renders form with password inputs and submit button", () => {
  renderForm();

  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test("displays error message when passwords do not match", async () => {
  renderForm();

  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  // Enter different passwords
  fireEvent.change(passwordInput, { target: { value: "password1" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "password2" } });

  // Submit the form
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorMessage = screen.getByText("Passwords do not match.");
    expect(errorMessage).toBeInTheDocument();
  });

  expect(mockOnSubmit).not.toHaveBeenCalled();
});

test("calls onSubmit with form data when passwords match", async () => {
  renderForm();

  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  // Enter matching passwords
  fireEvent.change(passwordInput, { target: { value: "Aa123456*" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "Aa123456*" } });

  // Submit the form
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      password: "Aa123456*",
      confirmPassword: "Aa123456*",
    } as ResetPasswordFields);
  });
});

test("displays success message when form submission is successful", async () => {
  mockOnSubmit.mockResolvedValueOnce({ message: "Password reset successful." });

  renderForm();

  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  // Enter matching passwords
  fireEvent.change(passwordInput, { target: { value: "Aa123456*" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "Aa123456*" } });

  // Submit the form
  fireEvent.click(submitButton);

  await waitFor(() => {
    const successMessage = screen.getByText("Password reset successful.");
    expect(successMessage).toBeInTheDocument();
  });
});

test("displays error message when form submission fails", async () => {
  mockOnSubmit.mockRejectedValueOnce(new Error("An unknown error occurred."));

  renderForm();

  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  // Enter matching passwords
  fireEvent.change(passwordInput, { target: { value: "Aa123456*" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "Aa123456*" } });

  // Submit the form
  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorMessage = screen.getByText("An unknown error occurred.");
    expect(errorMessage).toBeInTheDocument();
  });
});

test("renders ResetPasswordForm correctly", () => {
  renderForm();

  // Assert that the form renders correctly
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Forgot password?" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
});
