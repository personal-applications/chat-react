import SendMessageForm, { SendMessageFields } from "./SendMessageForm";

export default function MessageBox() {
  const onSubmit = (data: SendMessageFields) => {
    console.log(data);
    return Promise.resolve();
  };
  return (
    <div>
      <SendMessageForm onSubmit={onSubmit} />
    </div>
  );
}
