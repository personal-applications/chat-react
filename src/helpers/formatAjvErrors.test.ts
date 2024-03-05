import { formatAjvErrors } from "./formatAjvErrors";

test("should return an empty object when there are no errors", () => {
  const errors = {};
  const result = formatAjvErrors(errors);
  expect(result).toEqual({});
});

test("should format errors correctly", () => {
  const errors = {
    username: {
      type: "required",
    },
    email: {
      type: "format",
    },
    password: {
      type: "minLength",
    },
  };
  const result = formatAjvErrors(errors);
  expect(result).toStrictEqual({
    username: "This field is required.",
    email: "Invalid email address.",
    password: "Value is too short.",
  });
});

test("should format pattern error correctly", () => {
  const errors = {
    username: {
      type: "pattern",
    },
  };
  const result = formatAjvErrors(errors);
  expect(result).toStrictEqual({
    username: "Invalid value.",
  });
});

test("should format regex error correctly", () => {
  const errors = {
    username: {
      type: "regex",
    },
  };
  const result = formatAjvErrors(errors);
  expect(result).toStrictEqual({
    username: "Invalid value.",
  });
});

