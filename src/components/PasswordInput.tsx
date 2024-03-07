import React, { useState } from "react";
import Input, { InputProps } from "./Input";
import { Else, If, Then } from "react-if";
import IconEye from "./icons/IconEye";
import IconEyeInvisible from "./icons/IconEyeInvisible";

export type PasswordInputProps = Omit<InputProps, "type">;
export type PasswordInputType = "password" | "text";

const PasswordInput = React.forwardRef(
  (props: PasswordInputProps, ref: React.Ref<HTMLInputElement>) => {
    const [inputType, setInputType] = useState<PasswordInputType>("password");

    const onToggleInputType = () => {
      setInputType((prev) => (prev === "password" ? "text" : "password"));
    };

    return (
      <>
        <Input
          {...props}
          type={inputType}
          ref={ref}
          postIcon={
            <button type="button" onClick={onToggleInputType}>
              <If condition={inputType === "password"}>
                <Then>
                  <IconEye />
                </Then>
                <Else>
                  <IconEyeInvisible />
                </Else>
              </If>
            </button>
          }
        />
      </>
    );
  },
);

export default PasswordInput;
