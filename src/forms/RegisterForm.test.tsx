import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServerError } from "../services/error";
import RegisterForm, { RegisterFormFields } from "./RegisterForm";

test("renders correctly", () => {
  const tree = render(<RegisterForm onSubmit={vi.fn()} />);

  expect(tree).toMatchSnapshot();
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
  expect(screen.getByText("An unknown error occurred")).toBeInTheDocument();
});
