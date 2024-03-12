import useSWRMutation from "swr/mutation";
import ForgotPasswordForm, {
  ForgotPasswordFields,
} from "../forms/ForgotPasswordForm";
import { postData } from "../services/fetcher";

function ForgotPasswordPage() {
  const { trigger } = useSWRMutation<
    { message: string },
    Error,
    "/api/auth/forgot-password",
    ForgotPasswordFields
  >("/api/auth/forgot-password", postData);

  const onSubmit = async (data: ForgotPasswordFields) => {
    const { message } = await trigger(data);

    return { message };
  };

  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-[600px] mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-5">ChatHub</h1>
          <h1 className="text-bold text-center text-xl">Forgot Password</h1>
          <ForgotPasswordForm onSubmit={onSubmit} />
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
