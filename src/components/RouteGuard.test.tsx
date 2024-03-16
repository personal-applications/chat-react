import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import {
  JWT_KEY,
  deleteFromLocalStorage,
  saveToLocalStorage,
} from "../helpers/localStorage";
import RouteGuard, { RouteGuardCondition } from "./RouteGuard";
import { Mock } from "vitest";

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useNavigate: vi.fn(),
  };
});

const MockComponent = () => <div>Mock Component</div>;

const jwt = "mock-jwt";

const renderWithRouter = (condition: RouteGuardCondition) =>
  render(
    <MemoryRouter>
      <RouteGuard condition={condition}>
        <MockComponent />
      </RouteGuard>
    </MemoryRouter>,
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
