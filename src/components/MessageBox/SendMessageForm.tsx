import { JSONSchemaType } from "ajv";
import Input from "../Input";
import { useForm } from "react-hook-form";
import { ajvResolver } from "@hookform/resolvers/ajv";
import IconSend from "../icons/IconSend";

export type SendMessageFields = {
  content: string;
};

const schema: JSONSchemaType<SendMessageFields> = {
  type: "object",
  properties: {
    content: {
      type: "string",
      minLength: 1,
    },
  },
  required: ["content"],
  additionalProperties: false,
  errorMessage: {
    properties: {
      content: "Message content is required.",
    },
  },
};

type Prop = {
  onSubmit: (data: SendMessageFields) => Promise<void>;
};

export default function SendMessageForm({ onSubmit }: Prop) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SendMessageFields>({
    resolver: ajvResolver(schema),
  });

  const onSubmitAsync = async (data: SendMessageFields) => {
    // Call the prop function
    await onSubmit(data);
  };

  return (
    <form className="flex gap-6" onSubmit={handleSubmit(onSubmitAsync)}>
      <Input
        placeholder="Type a message"
        {...register("content")}
        error={errors.content?.message}
      />
      <button
        type="submit"
        role="button"
        className="btn btn-primary"
        data-testid="submit-btn"
      >
        <IconSend />
      </button>
    </form>
  );
}
