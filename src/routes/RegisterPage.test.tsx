import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import useSWRMutation from "swr/mutation";
import RegisterPage from "./RegisterPage";
import { Mock } from "vitest";

vi.mock("swr/mutation", () => ({
  default: vi.fn().mockReturnValue({}),
}));

test("should render the register page", () => {
  const tree = render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>,
  );

  expect(tree).toMatchSnapshot();
});

test("should trigger the register mutation on form submission", async () => {
  const triggerMock = vi.fn().mockResolvedValue({});
  (useSWRMutation as Mock).mockReturnValue({ trigger: triggerMock });

  render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>,
  );

  const firstNameInput = screen.getByPlaceholderText("First name");
  const lastNameInput = screen.getByPlaceholderText("Last name");
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
  const submitButton = screen.getByText("Sign up");

  await userEvent.type(firstNameInput, "Test");
  await userEvent.type(lastNameInput, "User");
  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "Password123*");
  await userEvent.type(confirmPasswordInput, "Password123*");
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(triggerMock).toHaveBeenCalledTimes(1);
    expect(triggerMock).toHaveBeenCalledWith({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "Password123*",
      confirmPassword: "Password123*",
    });
  });
});
