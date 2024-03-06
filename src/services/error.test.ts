import { isServerFromError } from "./error";

it("should return true for a valid error object", () => {
  const error = {
    status: "error",
    code: 500,
    message: "Internal Server Error",
    errors: [
      {
        field: "username",
        message: "Username is required",
      },
    ],
  };

  const result = isServerFromError(error);

  expect(result).toBe(true);
});

it("should return false for an invalid error object", () => {
  const error = {
    status: "error",
    code: "400",
    message: "Bad Request",
    errors: [
      {
        field: "email",
        message: "Email is invalid",
      },
    ],
  };

  const result = isServerFromError(error);

  expect(result).toBe(false);
});
