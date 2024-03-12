import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServerError } from "../services/error";
import RegisterForm, { RegisterFormFields } from "./RegisterForm";

test("displays validation errors when fields are left empty", async () => {
  const handleSubmit = vi.fn();
  render(<RegisterForm onSubmit={handleSubmit} />);

  await userEvent.click(screen.getByText(/Sign up/));

  expect(
    screen.getByText("First name must be at least 2 characters long."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Last name must be at least 2 characters long."),
  ).toBeInTheDocument();
  expect(screen.getByText("Invalid email format.")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
});

test("submits form data", async () => {
  const handleSubmit = vi.fn().mockResolvedValue(undefined);
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
  expect(
    screen.getByText("Success! You have been registered."),
  ).toBeInTheDocument();
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
  expect(screen.getByText("Email is already in use")).toBeInTheDocument();
});

test("display unknown error message when something goes wrong", async () => {
  const serverError = {
    message: "Something goes wrong",
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
  expect(screen.getByText("An unknown error occurred.")).toBeInTheDocument();
});

test("displays root error message on server message", async () => {
  const serverError: ServerError = {
    code: 500,
    errors: [],
    message: "Server error",
    status: "error",
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
  expect(screen.getByText(serverError.message)).toBeInTheDocument();
});

test("displays root error message on server error", async () => {
  const serverError: ServerError = {
    code: 500,
    errors: [
      {
        field: "confirmPassword",
        message: "Passwords do not match",
      },
    ],
    message: "Server error",
    status: "error",
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
  expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
});
