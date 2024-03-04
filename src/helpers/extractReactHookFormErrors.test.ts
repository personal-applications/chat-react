import { FieldErrors } from "react-hook-form";
import extractReactHookFormErrors from "./extractReactHookFormErrors";

test("Should work correctly", () => {
  type Fields = {
    firstName: "string";
    lastName: "string";
  };

  const errors: FieldErrors<Fields> = {
    firstName: { message: "Field is required", type: "required" },
    lastName: { message: "Field is required", type: "required" },
  };

  const result = extractReactHookFormErrors(errors);

  expect(result).toStrictEqual({
    "First Name": "Field is required",
    "Last Name": "Field is required",
  });
});
