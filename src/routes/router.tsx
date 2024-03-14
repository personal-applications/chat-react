import { createBrowserRouter } from "react-router-dom";
import ForgotPasswordPage from "./ForgotPasswordPage";
import LogInPage from "./LogInPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import HomePage from "./HomePage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
]);

export default router;
