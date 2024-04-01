import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SendMessageForm, { SendMessageFields } from "./SendMessageForm";

test("should render the send message form", () => {
  render(<SendMessageForm onSubmit={vi.fn()} />);

  const inputElement = screen.getByPlaceholderText("Type a message");
  const submitButton = screen.getByTestId("submit-btn");

  expect(inputElement).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test("should display error message when content is not provided", async () => {
  const onSubmitMock = vi.fn();
  render(<SendMessageForm onSubmit={onSubmitMock} />);

  const submitButton = screen.getByTestId("submit-btn");

  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(onSubmitMock).not.toHaveBeenCalled();
    expect(
      screen.getByText("Message content is required."),
    ).toBeInTheDocument();
  });
});

test("should call onSubmit function with correct data when form is submitted", async () => {
  const onSubmitMock = vi.fn();
  render(<SendMessageForm onSubmit={onSubmitMock} />);

  const inputElement = screen.getByPlaceholderText("Type a message");
  const submitButton = screen.getByTestId("submit-btn");

  await userEvent.type(inputElement, "Hello, World!");
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith({ content: "Hello, World!" });
  });
});
