import { postData } from "../../services/fetcher";
import SendMessageForm, { SendMessageFields } from "./SendMessageForm";
import useSWRMutation from "swr/mutation";

export type CreateMessageBody = SendMessageFields & {
  receiverId: number;
};

export default function MessageBox() {
  const { trigger } = useSWRMutation<
    { id: number },
    Error,
    "/api/messages",
    CreateMessageBody
  >("/api/messages", postData);

  const onSubmit = async (data: SendMessageFields) => {
    const body: CreateMessageBody = {
      content: data.content,
      receiverId: 1,
    };
    await trigger(body);
  };
  return (
    <div>
      <SendMessageForm onSubmit={onSubmit} />
    </div>
  );
}
