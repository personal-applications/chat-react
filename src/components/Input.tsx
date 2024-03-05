import { forwardRef } from "react";
import { If, Then } from "react-if";
import { twMerge } from "tailwind-merge";

type Prop = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  error?: string;
};

const Input = forwardRef(function Input(
  props: Prop,
  ref: React.Ref<HTMLInputElement>,
) {
  const { error, className } = props;
  let cssClass = className;
  if (error) {
    cssClass = twMerge(cssClass, "input-error");
  }

  return (
    <div className="flex w-full flex-col">
      <input {...props} className={cssClass} ref={ref} />
      <If condition={error}>
        <Then>
          <span className="pt-3 text-sm text-error">{error}</span>
        </Then>
      </If>
    </div>
  );
});

export default Input;
