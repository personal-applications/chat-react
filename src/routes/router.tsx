import { createBrowserRouter } from "react-router-dom";
import createRouteGuard from "../helpers/createRouteGuard";
import ForgotPasswordPage from "./ForgotPasswordPage";
import HomePage from "./HomePage";
import LogInPage from "./LogInPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import RootPage from "./RootPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
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
        path: "/home",
        element: createRouteGuard(HomePage, "loggedIn"),
      },
    ],
  },
]);

export default router;
