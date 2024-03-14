import { createBrowserRouter } from "react-router-dom";
import createRouteGuard from "../helpers/createRouteGuard";
import ForgotPasswordPage from "./ForgotPasswordPage";
import HomePage from "./HomePage";
import LogInPage from "./LogInPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: createRouteGuard(LogInPage, "loggedOut"),
  },
  {
    path: "/register",
    element: createRouteGuard(RegisterPage, "loggedOut"),
  },
  {
    path: "/forgot-password",
    element: createRouteGuard(ForgotPasswordPage, "loggedOut"),
  },
  {
    path: "/reset-password",
    element: createRouteGuard(ResetPasswordPage, "loggedOut"),
  },
  {
    path: "/",
    element: createRouteGuard(HomePage, "loggedIn"),
  },
]);

export default router;
