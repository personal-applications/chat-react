import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServerError } from "../services/error";
import RegisterForm, { RegisterFormFields } from "./RegisterForm";

test("renders correctly", () => {
  render(<RegisterForm onSubmit={vi.fn()} />);

  expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
});

test("displays validation errors when fields are left empty", async () => {
  const handleSubmit = vi.fn();
  render(<RegisterForm onSubmit={handleSubmit} />);

  await userEvent.click(screen.getByText(/Sign up/));

  expect(screen.getAllByText("Value is too short.")).toHaveLength(2);
  expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
  expect(screen.getAllByText("Invalid value.")).toHaveLength(2);
});

test("submits form data", async () => {
  const handleSubmit = vi.fn();
  render(<RegisterForm onSubmit={handleSubmit} />);

  await userEvent.type(screen.getByPlaceholderText("First name"), "John");
  await userEvent.type(screen.getByPlaceholderText("Last name"), "Doe");
  await userEvent.type(
    screen.getByPlaceholderText("Email"),
    "john.doe@example.com",
  );
  await userEvent.type(screen.getByPlaceholderText("Password"), "Aa123456!");
  await userEvent.type(
    screen.getByPlaceholderText("Confirm password"),
    "Aa123456!",
  );
  await userEvent.click(screen.getByText(/Sign up/));

  expect(handleSubmit).toHaveBeenCalledWith({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "Aa123456!",
    confirmPassword: "Aa123456!",
  });
});

test("displays server error message when server returns field-specific error", async () => {
  const serverError: ServerError = {
    code: 400,
    message: "Bad Request",
    status: "error",
    errors: [
      {
        field: "email",
        message: "Email is already in use",
      },
    ],
  };
  const handleSubmit = vi.fn().mockRejectedValue(serverError);
  render(<RegisterForm onSubmit={handleSubmit} />);

  const formData: RegisterFormFields = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "Aa123456!",
    confirmPassword: "Aa123456!",
  };

  await userEvent.type(
    screen.getByPlaceholderText("First name"),
    formData.firstName,
  );
  await userEvent.type(
    screen.getByPlaceholderText("Last name"),
    formData.lastName,
  );
  await userEvent.type(screen.getByPlaceholderText("Email"), formData.email);
  await userEvent.type(
    screen.getByPlaceholderText("Password"),
    formData.password,
  );
  await userEvent.type(
    screen.getByPlaceholderText("Confirm password"),
    formData.confirmPassword,
  );

  await userEvent.click(screen.getByText(/Sign up/));

  expect(handleSubmit).toHaveBeenCalled();

  await waitFor(() => {
    expect(screen.getByText("Email is already in use")).toBeInTheDocument();
  });
});