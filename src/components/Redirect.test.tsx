import { render } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { Mock } from "vitest";
import Redirect from "./Redirect";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

it("should navigate to the specified path", () => {
  const navigateMock = vi.fn();
  (useNavigate as Mock).mockReturnValue(navigateMock);

  render(<Redirect to="/dashboard" />);

  expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
});
