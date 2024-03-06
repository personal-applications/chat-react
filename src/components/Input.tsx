import React, { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { If, Then } from "react-if";
import { twMerge } from "tailwind-merge";

type Prop = Partial<UseFormRegisterReturn> &
  Pick<React.InputHTMLAttributes<HTMLInputElement>, "placeholder" | "type"> & {
    error?: string;
  };

const Input = forwardRef(function Input(
  { error, type = "text", ...props }: Prop,
  ref: React.Ref<HTMLInputElement>,
) {
  return (
    <div className="flex w-full flex-col">
      <label
        className={twMerge(
          "input input-bordered flex items-center gap-2",
          error && "input-error",
        )}
      >
        <input type={type} className="grow" {...props} ref={ref} />
      </label>

      <If condition={error}>
        <Then>
          <span className="pt-3 text-sm text-error">{error}</span>
        </Then>
      </If>
    </div>
  );
});

export default Input;
