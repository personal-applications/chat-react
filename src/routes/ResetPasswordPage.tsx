import useSWRMutation from "swr/mutation";
import ResetPasswordForm, {
  ResetPasswordFields,
} from "../forms/ResetPasswordForm";
import { postData } from "../services/fetcher";

function ForgotPasswordPage() {
  const { trigger } = useSWRMutation<
    { message: string },
    Error,
    "/api/auth/reset-password",
    ResetPasswordFields
  >("/api/auth/reset-password", postData);

  const onSubmit = async (data: ResetPasswordFields) => {
    const { message } = await trigger(data);

    return { message };
  };

  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-[600px] mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-5">ChatHub</h1>
          <h1 className="text-bold text-center text-xl"> Reset password </h1>
          <ResetPasswordForm onSubmit={onSubmit} />
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
