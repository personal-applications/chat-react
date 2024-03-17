import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useNavigate } from "react-router-dom";
import useSWRMutation from "swr/mutation";
import { Mock } from "vitest";
import LogInPage from "./LogInPage";
import { getFromLocalStorage } from "../helpers/localStorage";

vi.mock("swr/mutation", () => {
  return {
    default: vi.fn().mockReturnValue({}),
  };
});
vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useNavigate: vi.fn(),
  };
});

suite("LogInPage", () => {
  test("should render the login form", () => {
    const tree = render(
      <BrowserRouter>
        <LogInPage />
      </BrowserRouter>,
    );

    expect(tree).toMatchSnapshot();
  });

  test("should navigate to /home after successful login", async () => {
    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    const triggerMock = vi.fn().mockResolvedValue({ jwt: "dummyToken" });
    (useSWRMutation as Mock).mockReturnValue({
      trigger: triggerMock,
    });

    render(
      <BrowserRouter>
        <LogInPage />
      </BrowserRouter>,
    );

    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "Password123*",
    );
    await userEvent.click(screen.getByText("Log in"));

    expect(getFromLocalStorage("jwt")).toBe("dummyToken");
    expect(triggerMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Password123*",
    });
    expect(navigateMock).toHaveBeenCalledWith("/home");
  });
});
