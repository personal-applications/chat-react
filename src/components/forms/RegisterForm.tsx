import { ajvResolver } from "@hookform/resolvers/ajv";
import { JSONSchemaType } from "ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { useForm } from "react-hook-form";
import { If, Then } from "react-if";
import Input from "../Input";
import PasswordInput from "../PasswordInput";
import { PASSWORD_REGEX } from "../../constants";
import { ServerError, isServerFromError } from "../../services/error";

export type RegisterFormFields = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const schema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", pattern: PASSWORD_REGEX },
    confirmPassword: {
      type: "string",
      minLength: 1,
      const: { $data: "1/password" },
    },
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
} as unknown as JSONSchemaType<RegisterFormFields>;

export type Prop = {
  onSubmit: (data: RegisterFormFields) => Promise<void>;
};

export default function RegisterForm({ onSubmit }: Prop) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormFields>({
    resolver: ajvResolver(schema, { formats: fullFormats, $data: true }),
    reValidateMode: "onChange",
  });

  const asyncOnSubmit = async (data: RegisterFormFields) => {
    try {
      await onSubmit(data);
      setError("root.serverResponse", {
        message: "Success! You have been registered.",
      });
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
          setError("root.serverError", { message: serverError.message });
        }
      } else {
        setError("root.serverError", { message: "An unknown error occurred." });
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(asyncOnSubmit)}
      className="mt-6 flex flex-col gap-y-6 rounded-md bg-base-100 p-8"
    >
      <If condition={!isSubmitting && !!errors?.root?.serverResponse}>
        <Then>
          <div role="alert" className="alert alert-success">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errors.root?.serverResponse?.message}</span>
          </div>
        </Then>
      </If>
      <If condition={!isSubmitting && !!errors.root?.serverError}>
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
            <span>{errors.root?.serverError?.message}</span>
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

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        Sign up
      </button>
    </form>
  );
}
