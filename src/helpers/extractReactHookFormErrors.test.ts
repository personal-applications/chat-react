import extractReactHookFormErrors from "./extractReactHookFormErrors";

test("should return an empty object when there are no errors", () => {
  const errors = {};
  const result = extractReactHookFormErrors(errors);
  expect(result).toEqual({});
});

test("should extract errors correctly", () => {
  const errors = {
    username: {
      type: "required",
      message: "Username is required",
    },
    password: {
      type: "minLength",
      message: "Password should be at least 8 characters long",
    },
  };
  const result = extractReactHookFormErrors(errors);
  expect(result).toStrictEqual({
    Username: "Username is required",
    Password: "Password should be at least 8 characters long",
  });
});
