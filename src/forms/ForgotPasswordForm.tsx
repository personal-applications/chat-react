import { ajvResolver } from "@hookform/resolvers/ajv";
import { JSONSchemaType } from "ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { useForm } from "react-hook-form";
import { If, Then } from "react-if";
import { Link } from "react-router-dom";
import Input from "../components/Input";

export type ForgotPasswordFields = {
  email: string;
};

const schema: JSONSchemaType<ForgotPasswordFields> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      email: "Invalid email format.",
    },
  },
};

export type Prop = {
  onSubmit: (data: ForgotPasswordFields) => Promise<{ message: string }>;
};

export default function ForgotPasswordForm({ onSubmit }: Prop) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFields>({
    resolver: ajvResolver(schema, {
      formats: fullFormats,
      removeAdditional: true,
    }),
    reValidateMode: "onChange",
  });

  const asyncOnSubmit = async (data: ForgotPasswordFields) => {
    try {
      const { message } = await onSubmit(data);
      setError("root.serverResponse", { message });
    } catch (error) {
      setError("root.serverError", { message: "An unknown error occurred." });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(asyncOnSubmit)}
      className="mt-6 flex flex-col gap-y-6 rounded-md bg-base-100 p-8"
    >
      <If condition={!!errors?.root?.serverResponse}>
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

      <Input
        type="email"
        placeholder="Email"
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="ml-auto">
        <Link to="/login" className="link link-primary link-hover">
          Back to login
        </Link>
      </div>
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        Forgot
      </button>
    </form>
  );
}
