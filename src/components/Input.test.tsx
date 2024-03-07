import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";
import React from "react";

test("displays postIcon correctly", () => {
  const tree = render(
    <Input
      placeholder="Enter your name"
      postIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      }
    />,
  );

  expect(tree).toMatchSnapshot();
});

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
