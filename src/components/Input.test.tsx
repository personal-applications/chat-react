import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";
import React from "react";

test("displays error message correctly", () => {
  render(<Input placeholder="Enter your name" error="Invalid input" />);

  expect(screen.getByText("Invalid input")).toBeInTheDocument();
});

test("forwards ref correctly", () => {
  const ref = React.createRef<HTMLInputElement>();
  render(<Input placeholder="Enter your name" ref={ref} />);

  expect(ref.current).toBeInstanceOf(HTMLInputElement);
});

test("handles input correctly", async () => {
  const handleChange = vi.fn();
  render(<Input placeholder="Enter your name" onChange={handleChange} />);

  const input = screen.getByPlaceholderText(
    "Enter your name",
  ) as HTMLInputElement;
  await userEvent.type(input, "John Doe");

  expect(handleChange).toHaveBeenCalledTimes(8); // One event per character
  expect(input.value).toBe("John Doe");
});
