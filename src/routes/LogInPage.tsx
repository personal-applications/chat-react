import useSWRMutation from "swr/mutation";
import LogInForm, { LoginFormFields } from "../forms/LogInForm";
import { postData } from "../services/fetcher";

function LogInPage() {
  const { trigger } = useSWRMutation("/api/auth/login", postData);

  const onSubmit = async (data: LoginFormFields) => {
    await trigger(data);
  };

  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-[600px] mx-auto">
          <h1 className="text-xl font-semibold text-center">ChatHub</h1>
          <LogInForm onSubmit={onSubmit} />
        </div>
      </div>
    </>
  );
}

export default LogInPage;
