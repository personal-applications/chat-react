import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import useSWRMutation from "swr/mutation";
import { Mock } from "vitest";
import ForgotPasswordPage from "./ForgotPasswordPage";

vi.mock("swr/mutation", () => {
  return {
    default: vi.fn().mockReturnValue({}),
  };
});

test("should render the forgot password form", () => {
  const tree = render(
    <BrowserRouter>
      <ForgotPasswordPage />
    </BrowserRouter>,
  );

  expect(tree).toMatchSnapshot();
});

test("should trigger the forgot password mutation on form submission", async () => {
  const triggerMock = vi.fn().mockResolvedValue({ message: "Success" });
  (useSWRMutation as Mock).mockReturnValue({ trigger: triggerMock });

  render(
    <BrowserRouter>
      <ForgotPasswordPage />
    </BrowserRouter>,
  );

  const emailInput = screen.getByPlaceholderText("Email");
  const submitButton = screen.getByText("Forgot");

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(triggerMock).toHaveBeenCalledTimes(1);
    expect(triggerMock).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});
