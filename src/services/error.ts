import Ajv from "ajv";

const ajv = new Ajv({ removeAdditional: true });

export type ServerError = {
  status: string;
  code: number;
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

const errorSchema = {
  type: "object",
  properties: {
    status: {
      type: "string",
    },
    code: {
      type: "number",
    },
    message: {
      type: "string",
    },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: {
            type: "string",
          },
          message: {
            type: "string",
          },
        },
        required: ["field", "message"],
      },
    },
  },
  required: ["status", "code", "message", "errors"],
};

const validate = ajv.compile(errorSchema);
export const isServerFromError = (e: unknown) => {
  const valid = validate(e);
  return valid;
};
