import { pascalSnakeCase } from "change-case";
import { FieldErrors, FieldValues } from "react-hook-form";

export default function extractReactHookFormErrors<T extends FieldValues>(
  errors: FieldErrors<T>,
): Record<string, string> {
  const keys = Object.keys(errors);
  const messages = Object.values(errors).map((e) => e!.message);

  const fields = keys.map((k) => {
    const pSCase = pascalSnakeCase(k);
    return pSCase.replace("_", " ");
  });

  return fields.reduce<Record<string, string>>((acc, current, index) => {
    acc[current] = messages[index] as string;
    return acc;
  }, {});
}
