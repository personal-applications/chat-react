import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import LogInPage from "./LogInPage";
import ForgotPasswordPage from "./ForgotPasswordPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

export default router;
