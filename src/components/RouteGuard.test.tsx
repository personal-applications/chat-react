import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {
  JWT_KEY,
  deleteFromLocalStorage,
  saveToLocalStorage,
} from "../helpers/localStorage";
import RouteGuard, { RouteGuardCondition } from "./RouteGuard";

const MockComponent = () => <div>Mock Component</div>;

const jwt = "mock-jwt";

const renderWithRouter = (condition: RouteGuardCondition) =>
  render(
    <BrowserRouter>
      <RouteGuard condition={condition}>
        <MockComponent />
      </RouteGuard>
    </BrowserRouter>,
  );

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
  renderWithRouter("loggedIn");

  await waitFor(() => {
    expect(window.location.pathname).toEqual("/login");
  });
});

test("renders children when condition is 'loggedOut' and JWT does not exist", () => {
  renderWithRouter("loggedOut");

  const mockComponent = screen.getByText("Mock Component");
  expect(mockComponent).toBeInTheDocument();
});

test("redirects to '/home' when condition is 'loggedOut' and JWT exists", async () => {
  saveToLocalStorage(JWT_KEY, jwt);
  renderWithRouter("loggedOut");

  await waitFor(() => {
    expect(window.location.pathname).toEqual("/home");
  });
});
