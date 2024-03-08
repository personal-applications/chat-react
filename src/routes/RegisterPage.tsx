import useSWRMutation from "swr/mutation";
import RegisterForm, { RegisterFormFields } from "../forms/RegisterForm";
import { postData } from "../services/fetcher";

function RegisterPage() {
  const { trigger } = useSWRMutation("/api/auth/register", postData);

  const onSubmit = async (data: RegisterFormFields) => {
    await trigger(data);
  };

  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-[600px] mx-auto">
          <h1 className="text-xl font-semibold text-center">ChatHub</h1>
          <RegisterForm onSubmit={onSubmit} />
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
