import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import useSWRMutation from "swr/mutation";
import { Mock } from "vitest";
import ResetPasswordPage from "./ResetPasswordPage";

vi.mock("swr/mutation", () => ({
  default: vi.fn().mockReturnValue({}),
}));

test("should render the reset password page", () => {
  const tree = render(
    <BrowserRouter>
      <ResetPasswordPage />
    </BrowserRouter>,
  );

  expect(tree).toMatchSnapshot();
});

test("should trigger the reset password mutation on form submission", async () => {
  const triggerMock = vi.fn().mockResolvedValue({ message: "Success" });
  (useSWRMutation as Mock).mockReturnValue({ trigger: triggerMock });

  render(
    <MemoryRouter initialEntries={["/reset-password?token=token"]}>
      <ResetPasswordPage />
    </MemoryRouter>,
  );

  const passwordInput = screen.getByPlaceholderText("New Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const submitButton = screen.getByRole("button", { name: "Reset" });

  await userEvent.type(passwordInput, "Password123*");
  await userEvent.type(confirmPasswordInput, "Password123*");
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(triggerMock).toHaveBeenCalledTimes(1);
    expect(triggerMock).toHaveBeenCalledWith({
      newPassword: "Password123*",
      confirmPassword: "Password123*",
      token: "token",
    });
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});
