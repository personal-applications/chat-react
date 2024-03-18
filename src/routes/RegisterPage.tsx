import useSWRMutation from "swr/mutation";
import RegisterForm, {
  RegisterFormFields,
} from "../components/forms/RegisterForm";
import { postData } from "../services/fetcher";
import { Link } from "react-router-dom";

function RegisterPage() {
  const { trigger } = useSWRMutation("/api/auth/register", postData);

  const onSubmit = async (data: RegisterFormFields) => {
    await trigger(data);
  };

  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-[600px] mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-5">ChatHub</h1>
          <h1 className="text-bold text-center text-xl">Register</h1>
          <RegisterForm onSubmit={onSubmit} />
          <div className="flex flex-col gap-y-2 mt-3">
            <span className="text-center">
              Already have an account ?{" "}
              <Link to="/login" className="link link-primary link-hover">
                Log in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
