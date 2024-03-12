import { ajvResolver } from "@hookform/resolvers/ajv";
import { JSONSchemaType } from "ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { useForm } from "react-hook-form";
import { If, Then } from "react-if";
import { Link, useSearchParams } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { PASSWORD_REGEX } from "../constants";
import { ServerError, isServerFromError } from "../services/error";

export type ResetPasswordFields = {
  newPassword: string;
  confirmPassword: string;
  token?: string;
};

const schema: JSONSchemaType<ResetPasswordFields> = {
  type: "object",
  properties: {
    newPassword: { type: "string", pattern: PASSWORD_REGEX },
    confirmPassword: { type: "string", pattern: PASSWORD_REGEX },
    token: { type: "string", nullable: true },
  },
  required: ["newPassword", "confirmPassword"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      password:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      confirmPassword: "Passwords do not match.",
    },
  },
};

export type Prop = {
  onSubmit: (data: ResetPasswordFields) => Promise<{ message: string }>;
};

export default function ResetPasswordForm({ onSubmit }: Prop) {
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordFields>({
    resolver: ajvResolver(schema, {
      formats: fullFormats,
      removeAdditional: true,
    }),
    reValidateMode: "onChange",
  });

  const asyncOnSubmit = async (data: ResetPasswordFields) => {
    try {
      data.token = searchParams.get("token") ?? undefined;
      const { message } = await onSubmit(data);
      setError("root.serverResponse", { message });
    } catch (error) {
      if (isServerFromError(error)) {
        const e = error as ServerError;
        setError("root.serverError", {
          message: e.message,
        });

        return;
      }

      setError("root.serverError", {
        message: "An unknown error occurred.",
      });
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
      <If condition={!!errors?.root?.serverError}>
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

      <PasswordInput
        placeholder="Password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <PasswordInput
        placeholder="Confirm Password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Link to="/forgot-password" className="link link-primary link-hover">
        Forgot password?
      </Link>
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        Reset
      </button>
    </form>
  );
}
