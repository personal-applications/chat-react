import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";

test("renders correctly", () => {
  render(<RegisterForm onSubmit={vi.fn()} />);

  expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
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

  userEvent.click(screen.getByText(/Sign up/));

  await waitFor(() => expect(handleSubmit).toHaveBeenCalled());

  expect(handleSubmit).toHaveBeenCalledWith({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "Aa123456!",
    confirmPassword: "Aa123456!",
  });
});
