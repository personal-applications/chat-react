import { ajvResolver } from "@hookform/resolvers/ajv";
import { JSONSchemaType } from "ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { useForm } from "react-hook-form";
import { If, Then } from "react-if";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import { PASSWORD_REGEX } from "../constants";
import { ServerError, isServerFromError } from "../services/error";

export type LoginFormFields = {
  email: string;
  password: string;
};

const schema: JSONSchemaType<LoginFormFields> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", pattern: PASSWORD_REGEX },
  },
  required: ["email", "password"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      email: "Invalid email format.",
      password:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    },
  },
};

export type Prop = {
  onSubmit: (data: LoginFormFields) => Promise<void>;
};

export default function LogInForm({ onSubmit }: Prop) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormFields>({
    resolver: ajvResolver(schema, {
      formats: fullFormats,
      removeAdditional: true,
    }),
    reValidateMode: "onChange",
  });

  const asyncOnSubmit = async (data: LoginFormFields) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (isServerFromError(error)) {
        const serverError = error as ServerError;
        setError("root", { message: serverError.message });
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
      <If condition={!isSubmitting && !!errors.root}>
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
      <div className="ml-auto">
        <Link to="/forgot-password" className="link link-primary link-hover">
          Forgot password?
        </Link>
      </div>
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        Log in
      </button>
    </form>
  );
}
