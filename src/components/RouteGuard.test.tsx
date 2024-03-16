import { render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { Mock } from "vitest";
import {
  JWT_KEY,
  deleteFromLocalStorage,
  saveToLocalStorage,
} from "../helpers/localStorage";
import RouteGuard, { RouteGuardCondition } from "./RouteGuard";

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
  };
});

const MockComponent = () => <div>Mock Component</div>;

const jwt = "mock-jwt";

const renderWithRouter = (condition: RouteGuardCondition) =>
  render(
    <RouteGuard condition={condition}>
      <MockComponent />
    </RouteGuard>,
  );

const navigateMock = vi.fn();

beforeEach(() => {
  deleteFromLocalStorage(JWT_KEY);
});

test("renders children when condition is 'loggedIn' and JWT exists", () => {
  saveToLocalStorage(JWT_KEY, jwt);

  renderWithRouter("loggedIn");

  const mockComponent = screen.getByText("Mock Component");
  expect(mockComponent).toBeInTheDocument();
});

test("redirects to '/login' when condition is 'loggedIn' and JWT does not exist", async () => {
  (useNavigate as Mock).mockReturnValue(navigateMock);
  renderWithRouter("loggedIn");

  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});

test("renders children when condition is 'loggedOut' and JWT does not exist", () => {
  renderWithRouter("loggedOut");

  const mockComponent = screen.getByText("Mock Component");
  expect(mockComponent).toBeInTheDocument();
});

test("redirects to '/home' when condition is 'loggedOut' and JWT exists", async () => {
  (useNavigate as Mock).mockReturnValue(navigateMock);
  saveToLocalStorage(JWT_KEY, jwt);
  renderWithRouter("loggedOut");

  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith("/home");
  });
});
