import useSWRMutation from "swr/mutation";
import LogInForm, { LoginFormFields } from "../forms/LogInForm";
import { postData } from "../services/fetcher";
import { Link, useNavigate } from "react-router-dom";
import { JWT_KEY, saveToLocalStorage } from "../helpers/localStorage";

function LogInPage() {
  const navigate = useNavigate();
  const { trigger } = useSWRMutation<
    { jwt: string },
    Error,
    "/api/auth/login",
    LoginFormFields
  >("/api/auth/login", postData);

  const onSubmit = async (data: LoginFormFields) => {
    const { jwt } = await trigger(data);
    saveToLocalStorage(JWT_KEY, jwt);
    navigate("/home");
  };

  return (
    <>
      <div className="h-screen w-screen bg-neutral pt-40">
        <div className="w-[600px] mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-5">ChatHub</h1>
          <h1 className="text-bold text-center text-xl">Login</h1>
          <LogInForm onSubmit={onSubmit} />
          <div className="flex flex-col gap-y-2 mt-3">
            <span className="text-center">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary link-hover">
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogInPage;
