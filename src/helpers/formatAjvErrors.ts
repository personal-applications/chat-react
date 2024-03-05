import { FieldErrors, FieldValues } from "react-hook-form";

export function formatAjvErrors<T extends FieldValues>(
  errors: FieldErrors<T>,
): Record<keyof T, string> {
  if (!Object.keys(errors).length) {
    return {} as Record<keyof T, string>;
  }

  const result: Record<string, string> = {};
  const fields = Object.keys(errors);
  const types = Object.values(errors).map((error) => error!.type) as string[];

  types.forEach((type, index) => {
    if (type === "required") {
      result[fields[index]] = `This field is required.`;
    } else if (type === "format" && fields[index] === "email") {
      result[fields[index]] = `Invalid email address.`;
    } else if (type === "pattern") {
      result[fields[index]] = `Invalid value.`;
    } else if (type === "minLength") {
      result[fields[index]] = `Value is too short.`;
    } else if (type === "regex") {
      result[fields[index]] = `Invalid value.`;
    }
  });

  return result as Record<keyof T, string>;
}
