import { ajvResolver } from "@hookform/resolvers/ajv";
import { JSONSchemaType } from "ajv";
import { fullFormats } from "ajv-formats/dist/formats";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { PASSWORD_REGEX } from "../constants";
import { formatAjvErrors } from "../helpers/formatAjvErrors";

type RegisterFormFields = {
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

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    resolver: ajvResolver(schema, { formats: fullFormats }),
    reValidateMode: "onChange",
  });
  const formattedErrors = formatAjvErrors(errors);

  return (
    <form
      noValidate
      onSubmit={handleSubmit((d) => console.log(d))}
      className="mt-6 flex flex-col gap-y-6 rounded-md bg-base-100 p-8"
    >
      <div className="flex gap-x-6">
        <Input
          type="text"
          placeholder="First name"
          className="input input-bordered inline grow"
          error={formattedErrors.firstName}
          {...register("firstName")}
        />
        <Input
          type="text"
          placeholder="Last name"
          className="input input-bordered inline grow"
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
