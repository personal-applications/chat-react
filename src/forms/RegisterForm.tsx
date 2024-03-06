import { ajvResolver } from "@hookform/resolvers/ajv";
import { JSONSchemaType } from "ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { PASSWORD_REGEX } from "../constants";
import { formatAjvErrors } from "../helpers/formatAjvErrors";
import { ServerError, isServerFromError } from "../services/error";
import { If, Then } from "react-if";
import PasswordInput from "../components/PasswordInput";

export type RegisterFormFields = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const schema: JSONSchemaType<RegisterFormFields> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", pattern: PASSWORD_REGEX },
    confirmPassword: { type: "string", pattern: PASSWORD_REGEX },
    firstName: { type: "string", minLength: 2 },
    lastName: { type: "string", minLength: 2 },
  },
  required: ["email", "password", "confirmPassword"],
  additionalProperties: false,
};

export type Prop = {
  onSubmit: (data: RegisterFormFields) => Promise<void>;
};

export default function RegisterForm({ onSubmit }: Prop) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormFields>({
    resolver: ajvResolver(schema, { formats: fullFormats }),
    reValidateMode: "onChange",
  });
  const formattedErrors = formatAjvErrors(errors);

  const asyncOnSubmit = async (data: RegisterFormFields) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (isServerFromError(error)) {
        (error as ServerError).errors.forEach((e) => {
          setError(e.field as keyof RegisterFormFields, { message: e.message });
        });
      } else {
        setError("root", { message: "An unknown error occurred" });
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(asyncOnSubmit)}
      className="mt-6 flex flex-col gap-y-6 rounded-md bg-base-100 p-8"
    >
      <If condition={!!errors.root}>
        <Then>
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errors.root?.message}</span>
          </div>
        </Then>
      </If>
      <div className="flex gap-x-6">
        <Input
          type="text"
          placeholder="First name"
          error={formattedErrors.firstName}
          {...register("firstName")}
        />
        <Input
          type="text"
          placeholder="Last name"
          error={formattedErrors.lastName}
          {...register("lastName")}
        />
      </div>
      <Input
        type="email"
        placeholder="Email"
        className="input input-bordered w-full"
        error={formattedErrors.email}
        {...register("email")}
      />
      <Input
        type="password"
        placeholder="Password"
        className="input input-bordered w-full"
        error={formattedErrors.password}
        {...register("password")}
      />
      <Input
        type="password"
        placeholder="Confirm password"
        className="input input-bordered w-full"
        error={formattedErrors.confirmPassword}
        {...register("confirmPassword")}
      />

      <button className="btn btn-primary" type="submit">
        Sign up
      </button>
    </form>
  );
}
