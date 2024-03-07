import React, { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { If, Then } from "react-if";
import { twMerge } from "tailwind-merge";

export type InputProps = Partial<UseFormRegisterReturn> &
  Pick<React.InputHTMLAttributes<HTMLInputElement>, "placeholder" | "type"> & {
    error?: string;
    postIcon?: React.ReactElement;
  };

const Input = forwardRef(function Input(
  { error, type = "text", postIcon, ...props }: InputProps,
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
        <If condition={React.isValidElement(postIcon)}>
          <Then>{postIcon}</Then>
        </If>
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
