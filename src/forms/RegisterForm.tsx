import { ajvResolver } from "@hookform/resolvers/ajv";
import { JSONSchemaType } from "ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { useForm } from "react-hook-form";
import { If, Then } from "react-if";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import { PASSWORD_REGEX } from "../constants";
import { ServerError, isServerFromError } from "../services/error";

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
  errorMessage: {
    properties: {
      firstName: "First name must be at least 2 characters long.",
      lastName: "Last name must be at least 2 characters long.",
      email: "Invalid email format.",
      password:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      confirmPassword: "Passwords do not match.",
    },
  },
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

  const asyncOnSubmit = async (data: RegisterFormFields) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (isServerFromError(error)) {
        const serverError = error as ServerError;
        if (serverError.errors.length) {
          serverError.errors.forEach((e) => {
            setError(e.field as keyof RegisterFormFields, {
              message: e.message,
            });
          });
        } else {
          setError("root", { message: serverError.message });
        }
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
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          type="text"
          placeholder="Last name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>
      <Input
        type="email"
        placeholder="Email"
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordInput
        placeholder="Password"
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordInput
        placeholder="Confirm password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <button className="btn btn-primary" type="submit">
        Sign up
      </button>
    </form>
  );
}
