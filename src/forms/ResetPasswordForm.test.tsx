import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ResetPasswordForm, { ResetPasswordFields } from "./ResetPasswordForm";

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

  const passwordInput = screen.getByPlaceholderText("New Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test("displays error message when passwords do not match", async () => {
  renderForm();

  const passwordInput = screen.getByPlaceholderText("New Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  // Enter different passwords
  await userEvent.type(passwordInput, "password1");
  await userEvent.type(confirmPasswordInput, "password2");

  // Submit the form
  await userEvent.click(submitButton);

  const errorMessage = screen.getByText("Passwords do not match.");
  expect(errorMessage).toBeInTheDocument();

  expect(mockOnSubmit).not.toHaveBeenCalled();
});

test("calls onSubmit with form data when passwords match", async () => {
  renderForm();

  const passwordInput = screen.getByPlaceholderText("New Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  // Enter different passwords
  await userEvent.type(passwordInput, "Aa123456*");
  await userEvent.type(confirmPasswordInput, "Aa123456*");

  // Submit the form
  await userEvent.click(submitButton);

  expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  expect(mockOnSubmit).toHaveBeenCalledWith({
    newPassword: "Aa123456*",
    confirmPassword: "Aa123456*",
  } as ResetPasswordFields);
});

test("displays success message when form submission is successful", async () => {
  mockOnSubmit.mockResolvedValueOnce({ message: "Password reset successful." });

  renderForm();

  const passwordInput = screen.getByPlaceholderText("New Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  // Enter different passwords
  await userEvent.type(passwordInput, "Aa123456*");
  await userEvent.type(confirmPasswordInput, "Aa123456*");

  // Submit the form
  await userEvent.click(submitButton);

  const successMessage = screen.getByText("Password reset successful.");
  expect(successMessage).toBeInTheDocument();
});

test("displays error message when form submission fails", async () => {
  mockOnSubmit.mockRejectedValueOnce(new Error("An unknown error occurred."));

  renderForm();

  const passwordInput = screen.getByPlaceholderText("New Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  // Enter different passwords
  await userEvent.type(passwordInput, "Aa123456*");
  await userEvent.type(confirmPasswordInput, "Aa123456*");

  // Submit the form
  await userEvent.click(submitButton);

  const errorMessage = screen.getByText("An unknown error occurred.");
  expect(errorMessage).toBeInTheDocument();
});

test("renders ResetPasswordForm correctly", () => {
  const tree = renderForm();

  expect(tree).toMatchSnapshot();
});
