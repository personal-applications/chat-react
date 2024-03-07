import { fireEvent, render, screen } from "@testing-library/react";
import PasswordInput from "./PasswordInput";

test("renders without crashing", () => {
  const tree = render(<PasswordInput placeholder="Enter password" />);

  expect(tree).toMatchSnapshot();
});

test("toggles password visibility", () => {
  render(<PasswordInput placeholder="Enter password" />);
  const input = screen.getByPlaceholderText("Enter password");
  const toggleButton = screen.getByRole("button");

  // Initially, the input type should be 'password'
  expect(input).toHaveAttribute("type", "password");

  // After clicking the toggle button, the input type should be 'text'
  fireEvent.click(toggleButton);
  expect(input).toHaveAttribute("type", "text");

  // After clicking the toggle button again, the input type should be 'password' again
  fireEvent.click(toggleButton);
  expect(input).toHaveAttribute("type", "password");
});
